import "server-only";

import fs from "node:fs/promises";
import path from "node:path";

import type {
  ArtifactSection,
  ExperimentIdea,
  PaperArtifact,
  RelatedPaper,
} from "@/types/artifact";

type ManifestRow = {
  file: string;
  text_file: string;
  metadata_file: string;
  title: string;
  authors: string;
  year: string;
  doi: string;
  pages: string;
  chars_extracted: string;
  abstract: string;
};

type ExtractMetadata = Record<string, string>;

const MANIFEST_PATH = path.join(process.cwd(), "..", "pdf_extracts", "manifest.csv");
const EXTRACT_ROOT = path.join(process.cwd(), "..", "pdf_extracts");

function parseCsv(content: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = "";
  let inQuotes = false;

  for (let index = 0; index < content.length; index += 1) {
    const character = content[index];
    const nextCharacter = content[index + 1];

    if (character === '"') {
      if (inQuotes && nextCharacter === '"') {
        currentField += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (character === "," && !inQuotes) {
      currentRow.push(currentField);
      currentField = "";
      continue;
    }

    if ((character === "\n" || character === "\r") && !inQuotes) {
      if (character === "\r" && nextCharacter === "\n") {
        index += 1;
      }

      if (currentField.length > 0 || currentRow.length > 0) {
        currentRow.push(currentField);
        rows.push(currentRow);
        currentRow = [];
        currentField = "";
      }
      continue;
    }

    currentField += character;
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }

  return rows;
}

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function normalizeExtractText(value: string): string {
  return value
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{4,}/g, "\n\n\n")
    .trim();
}

function resolveExtractPath(relativePath: string): string {
  return path.resolve(process.cwd(), "..", relativePath);
}

function isPlaceholderTitle(value: string): boolean {
  const normalized = normalizeWhitespace(value).toLowerCase();
  return (
    !normalized ||
    normalized.startsWith("paper title") ||
    normalized.startsWith("--- page") ||
    normalized === "e"
  );
}

function isPlaceholderAuthor(value: string): boolean {
  const normalized = normalizeWhitespace(value).toLowerCase();
  return !normalized || normalized === "user" || normalized === "unknown author";
}

function isLikelyBoilerplateLine(value: string): boolean {
  const normalized = normalizeWhitespace(value).toLowerCase();

  return (
    !normalized ||
    normalized.startsWith("--- page") ||
    normalized.startsWith("accepted for publication") ||
    normalized.startsWith("http://") ||
    normalized.startsWith("https://") ||
    normalized.startsWith("doi:") ||
    normalized.startsWith("abstract") ||
    normalized.startsWith("keywords")
  );
}

function isSectionHeadingLine(value: string): boolean {
  return /^(?:[IVX]+|\d+)\.?\s+[A-Z]/.test(normalizeWhitespace(value));
}

function extractAbstractText(text: string): string {
  const abstractMatch = text.match(/Abstract[—-]\s*([\s\S]*?)(?:Keywords?\s*[-—:]|I\.\s*INTRODUCTION|INTRODUCTION)/i);

  if (abstractMatch?.[1]) {
    return normalizeWhitespace(abstractMatch[1]);
  }

  return "";
}

function extractKeywordsText(text: string): string {
  const keywordsMatch = text.match(/Keywords?\s*[-—:]\s*([^\n\r]+)/i);
  return normalizeWhitespace(keywordsMatch?.[1] || "");
}

function extractIntroExcerpt(text: string): string {
  const lines = text.split(/\r?\n/).map(normalizeWhitespace);
  const introIndex = lines.findIndex((line) => /^I\.\s*INTRODUCTION/i.test(line) || /^INTRODUCTION$/i.test(line));

  if (introIndex < 0) {
    return "";
  }

  const excerptLines: string[] = [];

  for (let index = introIndex + 1; index < lines.length; index += 1) {
    const line = lines[index];

    if (!line) {
      if (excerptLines.length > 0) {
        break;
      }
      continue;
    }

    if (isSectionHeadingLine(line)) {
      break;
    }

    if (isLikelyBoilerplateLine(line)) {
      continue;
    }

    excerptLines.push(line);
    if (excerptLines.join(" ").length >= 520) {
      break;
    }
  }

  return normalizeWhitespace(excerptLines.join(" "));
}

function deriveTitleFromText(text: string): string {
  const lines = text.split(/\r?\n/).map(normalizeWhitespace).filter(Boolean);

  for (const line of lines) {
    if (isLikelyBoilerplateLine(line)) {
      continue;
    }

    if (line.length >= 5 && line.length <= 220) {
      return line;
    }
  }

  return "";
}

function looksLikeAuthorLine(value: string): boolean {
  const normalized = normalizeWhitespace(value);

  if (!normalized || /@/.test(normalized) || /\d/.test(normalized)) {
    return false;
  }

  const lowerValue = normalized.toLowerCase();
  const affiliationTerms = [
    "faculty",
    "university",
    "college",
    "department",
    "school",
    "institute",
    "laboratory",
    "center",
    "centre",
    "sector",
    "campus",
    "research",
    "engineering",
  ];

  if (affiliationTerms.some((term) => lowerValue.includes(term))) {
    return false;
  }

  const wordCount = normalized.split(/\s+/).length;
  return wordCount >= 2 && wordCount <= 8;
}

function extractAuthorsFromText(text: string, title: string): string[] {
  const lines = text.split(/\r?\n/);
  const titleIndex = lines.findIndex((line) => normalizeWhitespace(line) === title);
  const startIndex = titleIndex >= 0 ? titleIndex + 1 : 0;
  const authors: string[] = [];

  for (let index = startIndex; index < lines.length; index += 1) {
    const line = normalizeWhitespace(lines[index]);

    if (!line) {
      if (authors.length > 0) {
        break;
      }
      continue;
    }

    if (isLikelyBoilerplateLine(line) || /^\d+\.?\s+Introduction/i.test(line)) {
      break;
    }

    const parts = line
      .split(/[;,]/)
      .map((part) => normalizeWhitespace(part.replace(/\b\d+(?:,\s*\d+)*\b/g, "")))
      .filter(Boolean);

    const candidates = parts.length > 1 ? parts : [line];

    for (const candidate of candidates) {
      if (looksLikeAuthorLine(candidate) && !authors.includes(candidate)) {
        authors.push(candidate);
      }
    }
  }

  return authors;
}

async function readExtractMetadata(relativePath: string): Promise<ExtractMetadata> {
  try {
    const rawMetadata = await fs.readFile(resolveExtractPath(relativePath), "utf8");
    return JSON.parse(rawMetadata) as ExtractMetadata;
  } catch {
    return {};
  }
}

async function readTextExtract(relativePath: string): Promise<string> {
  try {
    return await fs.readFile(resolveExtractPath(relativePath), "utf8");
  } catch {
    return "";
  }
}

function humanizeFromFilename(filePath: string): string {
  const baseName = path.basename(filePath, path.extname(filePath));
  return normalizeWhitespace(
    baseName.replace(/[_-]+/g, " ").replace(/\s+([a-z])/g, (_, letter: string) => ` ${letter.toUpperCase()}`)
  );
}

function splitAuthors(rawAuthors: string): string[] {
  const normalized = normalizeWhitespace(rawAuthors);

  if (!normalized) {
    return ["Unknown Author"];
  }

  if (normalized.includes(";")) {
    return normalized
      .split(";")
      .map((author) => normalizeWhitespace(author))
      .filter(Boolean);
  }

  if (normalized.includes(" and ")) {
    return normalized
      .split(/\s+and\s+/i)
      .map((author) => normalizeWhitespace(author))
      .filter(Boolean);
  }

  if (normalized.includes(",") && normalized.split(",").length > 2) {
    return normalized
      .split(",")
      .map((author) => normalizeWhitespace(author))
      .filter(Boolean);
  }

  return [normalized];
}

function inferPublicationType(title: string, doi: string): PaperArtifact["publicationType"] {
  const candidate = `${title} ${doi}`.toLowerCase();

  if (candidate.includes("arxiv") || candidate.includes("preprint")) {
    return "Preprint";
  }

  if (candidate.includes("survey") || candidate.includes("review")) {
    return "Journal Article";
  }

  if (
    candidate.includes("proceeding") ||
    candidate.includes("conference") ||
    candidate.includes("workshop") ||
    candidate.startsWith("10.1109")
  ) {
    return "Proceedings Article";
  }

  if (candidate.includes("chapter")) {
    return "Book Chapter";
  }

  if (candidate.includes("posted")) {
    return "Posted Content";
  }

  return "Journal Article";
}

function inferTags(title: string, abstract: string): string[] {
  const searchableText = `${title} ${abstract}`.toLowerCase();
  const inferredTags = [
    ["iot", "IoT"],
    ["tinyml", "TinyML"],
    ["edge", "Edge Computing"],
    ["fog", "Fog Computing"],
    ["cloud", "Cloud Integration"],
    ["uav", "UAV"],
    ["drone", "UAV"],
    ["lora", "LoRa"],
    ["lpwan", "LPWAN"],
    ["5g", "5G"],
    ["sensor fusion", "Sensor Fusion"],
    ["machine learning", "Machine Learning"],
    ["reinforcement learning", "Reinforcement Learning"],
    ["anomal", "Anomaly Detection"],
    ["irrigat", "Smart Irrigation"],
    ["crop", "Crop Monitoring"],
    ["energy", "Energy Efficiency"],
    ["battery", "Energy Efficiency"],
    ["embedded", "Embedded Systems"],
    ["agricultur", "Precision Agriculture"],
  ] as const;

  const tags = inferredTags.reduce<string[]>((accumulator, [needle, tag]) => {
    if (searchableText.includes(needle) && !accumulator.includes(tag)) {
      accumulator.push(tag);
    }
    return accumulator;
  }, []);

  if (tags.length === 0) {
    tags.push("Precision Agriculture");
  }

  return tags.slice(0, 6);
}

function buildSummary(abstract: string, title: string): string {
  const fallback = `Auto-generated summary for ${title}. The extract is ready for a richer synthesis, citations, and manual highlights.`;
  const cleanAbstract = normalizeWhitespace(abstract);

  if (!cleanAbstract) {
    return fallback;
  }

  return cleanAbstract.length > 280
    ? `${cleanAbstract.slice(0, 277)}...`
    : cleanAbstract;
}

function getReadTime(pages: number, abstract: string): number {
  const abstractBasedEstimate = Math.max(4, Math.round(normalizeWhitespace(abstract).length / 900));
  return Math.max(4, Math.round(pages * 1.2), abstractBasedEstimate);
}

function getHeatScore(year: number, pages: number, tags: string[]): number {
  const ageBonus = Math.max(0, 2026 - year);
  const score = 40 + Math.min(24, pages * 2) + Math.min(18, tags.length * 3) - Math.min(12, ageBonus);
  return Math.max(24, Math.min(96, Math.round(score)));
}

function buildKeyClaims(
  title: string,
  pages: number,
  charsExtracted: number,
  doi: string,
  abstract: string,
  introExcerpt: string
): string[] {
  return [
    abstract
      ? "The abstract is captured directly from the text extract, so the card can show a readable summary even when PDF metadata is incomplete."
      : `This extract is visible in the frontend so the full set of paper previews can be browsed immediately.`,
    introExcerpt
      ? "An opening excerpt is available from the introduction to help users scan the paper's actual framing and scope."
      : "The snapshot keeps the extract browseable while a fuller manual synthesis is added later.",
    doi ? `Metadata is linked to DOI ${doi}.` : "Metadata is available without a DOI and can be completed later.",
    `The loaded record represents ${pages || 0} pages and ${charsExtracted || 0} captured characters from ${title}.`,
  ];
}

function buildExperiments(title: string, tags: string[], introExcerpt: string): ExperimentIdea[] {
  const coreTags = tags.slice(0, 3);
  const introFocus = introExcerpt ? introExcerpt.slice(0, 120) : "the extracted paper";

  return [
    {
      id: `${title}-exp-1`,
      title: `Draft an editorial synthesis for ${title}`,
      description:
        `Use the extracted abstract, tags, and metadata to create a short research note with a problem statement, proposed method, and deployment implications for ${introFocus}.`,
      difficulty: "medium",
      tags: coreTags,
    },
    {
      id: `${title}-exp-2`,
      title: `Turn the extract into a review-ready card for the sidebar`,
      description:
        "Refine the snapshot into a richer synopsis, then compare it with neighboring papers to surface likely research directions and gaps.",
      difficulty: "easy",
      tags: coreTags.length > 0 ? coreTags : ["Precision Agriculture"],
    },
  ];
}

function buildSections(
  row: ManifestRow,
  title: string,
  authors: string[],
  pages: number,
  charsExtracted: number,
  abstract: string,
  introExcerpt: string,
  keywords: string[],
  textExtract: string
): ArtifactSection[] {
  const doiLine = row.doi ? `- DOI: ${row.doi}` : "- DOI: not supplied in the manifest";
  const keywordLine = keywords.length > 0 ? `- Keywords: ${keywords.join(", ")}` : "- Keywords: not supplied in the text extract";
  const previewExcerpt = introExcerpt || abstract || "The extract does not expose an introduction snippet, but the paper is still browseable from metadata.";
  const authorLine = authors.length > 0 ? `- Detected authors: ${authors.slice(0, 5).join(", " )}${authors.length > 5 ? ", …" : ""}` : "- Detected authors: not recovered";
  const fullExtract = normalizeExtractText(textExtract);

  return [
    {
      id: `${title}-extract-preview`,
      type: "markdown",
      title: "Paper Snapshot",
      content: `## Paper Snapshot

This card is generated from the folder extract so users can browse every paper immediately, even when the original PDF metadata is incomplete.

- Display title: ${title}
- Source authors: ${authors.length > 0 ? authors.slice(0, 3).join(", ") : "Unknown"}
- Source PDF: ${row.file}
- Text extract: ${row.text_file}
- Metadata file: ${row.metadata_file}
- Pages extracted: ${pages || "unknown"}
- Characters extracted: ${charsExtracted || "unknown"}
${keywordLine}
${doiLine}
${authorLine}

> Snapshot note: this card is built from the OCR/text extract so users can browse the paper immediately, then refine it with citations and highlights later.
`,
    },
    {
      id: `${title}-text-preview`,
      type: "markdown",
      title: "Text Preview",
      content: `## Extracted Text Preview

### Abstract

${abstract || "No abstract text was recovered from the extract."}

### Opening Excerpt

${previewExcerpt}

### Why This Matters

This preview uses the actual OCR/text extract, so the frontend can show meaningful content even when the PDF metadata is sparse or placeholder-filled.
`,
    },
    {
      id: `${title}-full-extract`,
      type: "extract",
      title: "Full Text Extract",
      content: fullExtract || "No text extract was recovered for this paper.",
    },
  ];
}

async function toPaperArtifact(row: ManifestRow): Promise<PaperArtifact> {
  const rawTitle = normalizeWhitespace(row.title);
  const derivedTitle = humanizeFromFilename(row.file);
  const textExtract = await readTextExtract(row.text_file);
  const metadata = await readExtractMetadata(row.metadata_file);

  const extractedTitle = deriveTitleFromText(textExtract);
  const metadataTitle = normalizeWhitespace(metadata.Title || metadata.title || "");
  const title =
    (!isPlaceholderTitle(rawTitle) ? rawTitle : "") ||
    extractedTitle ||
    (!isPlaceholderTitle(metadataTitle) ? metadataTitle : "") ||
    derivedTitle;

  const year = Number.parseInt(row.year, 10) || new Date().getFullYear();
  const pages = Number.parseInt(row.pages, 10) || 0;
  const charsExtracted = Number.parseInt(row.chars_extracted, 10) || 0;
  const abstract = normalizeWhitespace(row.abstract.replace(/--- Page \d+ ---\s*/g, ""));
  const publicationType = inferPublicationType(title, row.doi);
  const tags = inferTags(title, abstract);
  const parsedAuthors = extractAuthorsFromText(textExtract, title);
  const manifestAuthors = splitAuthors(row.authors);
  const metadataAuthors = splitAuthors(metadata.Author || metadata.author || "");
  const authors =
    parsedAuthors.length > 0
      ? parsedAuthors
      : metadataAuthors.length > 0 && !isPlaceholderAuthor(metadataAuthors[0])
        ? metadataAuthors
        : !isPlaceholderAuthor(row.authors)
          ? manifestAuthors
          : metadataAuthors;
    const introExcerpt = extractIntroExcerpt(textExtract);
    const keywords = extractKeywordsText(textExtract)
      .split(/[,;]+/)
      .map((keyword) => normalizeWhitespace(keyword))
      .filter(Boolean)
      .slice(0, 6);
    const normalizedAbstract = normalizeWhitespace(extractAbstractText(textExtract) || abstract || "");

  return {
    id: path.basename(row.metadata_file, path.extname(row.metadata_file)),
    title,
    authors,
    year,
    publicationType,
    abstract: normalizedAbstract || abstract || `Placeholder abstract for ${title}.`,
    summary: buildSummary(normalizedAbstract || abstract, title),
    whyItMatters:
      `This extract is visible in the frontend so the full set of paper previews can be browsed immediately. Replace this placeholder with a fuller note as the dataset is curated.`,
    tags,
    category: publicationType,
    heatScore: getHeatScore(year, pages, tags),
    readTime: getReadTime(pages, abstract),
    keyClaims: buildKeyClaims(title, pages, charsExtracted, row.doi, normalizedAbstract || abstract, introExcerpt),
    experiments: buildExperiments(title, tags, introExcerpt),
    sections: buildSections(row, title, authors, pages, charsExtracted, normalizedAbstract || abstract, introExcerpt, keywords, textExtract),
    relatedPapers: [] satisfies RelatedPaper[],
    source: "pdf_extracts",
    doi: row.doi || undefined,
  };
}

export async function loadExtractedPaperArtifacts(): Promise<PaperArtifact[]> {
  const manifestText = await fs.readFile(MANIFEST_PATH, "utf8");
  const rows = parseCsv(manifestText);

  if (rows.length < 2) {
    return [];
  }

  const [headerRow, ...dataRows] = rows;

  return Promise.all(
    dataRows
      .filter((row) => row.length > 0 && row.some((field) => field.trim().length > 0))
      .map(async (row) => {
      const record = headerRow.reduce<Partial<ManifestRow>>((accumulator, header, index) => {
        accumulator[header as keyof ManifestRow] = row[index] ?? "";
        return accumulator;
      }, {});

        return toPaperArtifact(record as ManifestRow);
      })
  );
}
