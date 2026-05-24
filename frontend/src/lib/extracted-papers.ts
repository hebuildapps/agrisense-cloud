import "server-only";

import fs from "node:fs/promises";
import path from "node:path";

import type {
  ArtifactSection,
  ExperimentIdea,
  PaperArtifact,
  RelatedPaper,
} from "@/types/artifact";
import {
  cleanText,
  cleanTitle,
  cleanAuthorName,
  cleanAbstract,
  cleanSectionContent,
  generateSummary,
  truncateText,
} from "@/lib/text-cleaning";

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

function resolveExtractPath(relativePath: string): string {
  return path.resolve(process.cwd(), "..", relativePath);
}

function isPlaceholderTitle(value: string): boolean {
  const normalized = cleanText(value).toLowerCase();
  return (
    !normalized ||
    normalized.startsWith("paper title") ||
    normalized.startsWith("--- page") ||
    normalized === "e"
  );
}

function isPlaceholderAuthor(value: string): boolean {
  const normalized = cleanText(value).toLowerCase();
  return !normalized || normalized === "user" || normalized === "unknown author";
}

function isLikelyBoilerplateLine(value: string): boolean {
  const normalized = cleanText(value).toLowerCase();

  return (
    !normalized ||
    normalized.startsWith("--- page") ||
    normalized.startsWith("accepted for publication") ||
    normalized.startsWith("http://") ||
    normalized.startsWith("https://") ||
    normalized.startsWith("doi:") ||
    (normalized.startsWith("abstract") && normalized.length < 50) ||
    (normalized.startsWith("keywords") && normalized.length < 50)
  );
}

function isSectionHeadingLine(value: string): boolean {
  return /^(?:[IVX]+|\d+)\.?\s+[A-Z]/.test(cleanText(value));
}

function extractAbstractFromText(text: string): string {
  const cleaned = cleanText(text);
  
  const abstractMatch = cleaned.match(
    /(?:^|\n)(?:Abstract|Biography)[—-]?\s*([\s\S]*?)(?=\n(?:Keywords?|I\.\s*INTRODUCTION|INTRODUCTION\s*\n))/i
  );

  if (abstractMatch?.[1]) {
    return cleanAbstract(abstractMatch[1]);
  }

  // Try simpler pattern
  const simpleMatch = cleaned.match(
    /(?:Abstract|Biography)[:\s]*([\s\S]{100,})/i
  );
  if (simpleMatch?.[1]) {
    return cleanAbstract(simpleMatch[1].substring(0, 1000));
  }

  return "";
}

function extractKeywordsFromText(text: string): string[] {
  const cleaned = cleanText(text);
  
  const keywordsMatch = cleaned.match(
    /(?:Keywords?|Index Terms)[-—:]\s*([^\n]+)/i
  );
  
  if (keywordsMatch?.[1]) {
    return keywordsMatch[1]
      .split(/[,;|]+/)
      .map(k => cleanText(k).trim())
      .filter(k => k.length > 2 && k.length < 30)
      .slice(0, 8);
  }
  
  return [];
}

function extractIntroExcerpt(text: string): string {
  const cleaned = cleanText(text);
  const lines = cleaned.split(/\n{2,}/);
  
  const introIndex = lines.findIndex(
    (line) => /^I\.\s*INTRODUCTION/i.test(line) || 
               /^INTRODUCTION$/i.test(line) ||
               /^\s*1\s+Introduction/i.test(line)
  );

  if (introIndex < 0) {
    // Try first paragraph after abstract
    const abstractMatch = cleaned.match(/(?:Abstract|Biography)[:\s]*([\s\S]{100,})/i);
    if (abstractMatch) {
      const afterAbstract = cleaned.substring(cleaned.indexOf(abstractMatch[0]) + abstractMatch[0].length);
      const firstPara = afterAbstract.split(/\n{2,}/).find(p => p.trim().length > 100);
      if (firstPara) {
        return truncateText(firstPara, 520);
      }
    }
    return "";
  }

  const excerptLines: string[] = [];

  for (let index = introIndex + 1; index < lines.length; index += 1) {
    const line = cleanText(lines[index]);

    if (!line || line.length < 10) continue;

    if (isSectionHeadingLine(line)) break;

    if (isLikelyBoilerplateLine(line)) continue;

    excerptLines.push(line);
    if (excerptLines.join(" ").length >= 520) break;
  }

  return generateSummary(excerptLines.join(" "), 520);
}

function deriveTitleFromText(text: string): string {
  const cleaned = cleanText(text);
  const lines = cleaned.split(/\n{2,}/).filter(Boolean);

  for (const line of lines) {
    const trimmed = cleanText(line);
    
    if (!trimmed || trimmed.length < 10) continue;
    if (isLikelyBoilerplateLine(trimmed)) continue;
    
    // Good title candidates are between 20-250 chars
    if (trimmed.length >= 20 && trimmed.length <= 250) {
      return trimmed;
    }
  }

  return "";
}

function looksLikeAuthorLine(value: string): boolean {
  const normalized = cleanText(value);

  if (!normalized || /@/.test(normalized) || /\d{5,}/.test(normalized)) {
    return false;
  }

  const lowerValue = normalized.toLowerCase();
  const skipTerms = [
    "faculty", "university", "college", "department", "school",
    "institute", "laboratory", "center", "centre", "sector",
    "campus", "research", "engineering", "technology", "abstract",
    "introduction", "keywords", "doi", "http", "copyright"
  ];

  if (skipTerms.some((term) => lowerValue.includes(term))) {
    return false;
  }

  const wordCount = normalized.split(/\s+/).length;
  return wordCount >= 2 && wordCount <= 6;
}

function extractAuthorsFromText(text: string, title: string): string[] {
  const cleaned = cleanText(text);
  const lines = cleaned.split(/\n{2,}/);
  
  const titleIndex = lines.findIndex((line) => cleanText(line).includes(title.substring(0, 30)));
  const startIndex = titleIndex >= 0 ? titleIndex + 1 : 0;
  const authors: string[] = [];

  for (let index = startIndex; index < lines.length; index += 1) {
    const line = cleanText(lines[index]);

    if (!line || line.length < 5) {
      if (authors.length > 0) break;
      continue;
    }

    if (isLikelyBoilerplateLine(line) || /^\d+\.?\s+Introduction/i.test(line)) {
      break;
    }

    // Split by common separators
    const parts = line
      .split(/[;,]/)
      .map((part) => cleanText(part.replace(/\b\d+(?:,\s*\d+)*\b/g, "")).trim())
      .filter(Boolean);

    const candidates = parts.length > 1 ? parts : [line];

    for (const candidate of candidates) {
      if (looksLikeAuthorLine(candidate) && !authors.includes(candidate)) {
        authors.push(cleanAuthorName(candidate));
      }
    }
    
    if (authors.length >= 8) break;
  }

  return authors;
}

async function readExtractMetadata(relativePath: string): Promise<ExtractMetadata> {
  try {
    const rawMetadata = await fs.readFile(resolveExtractPath(relativePath), "utf8");
    const parsed = JSON.parse(rawMetadata) as ExtractMetadata;
    // Clean metadata values
    const cleaned: ExtractMetadata = {};
    for (const [key, value] of Object.entries(parsed)) {
      cleaned[key] = cleanText(value as string);
    }
    return cleaned;
  } catch {
    return {};
  }
}

async function readTextExtract(relativePath: string): Promise<string> {
  try {
    const raw = await fs.readFile(resolveExtractPath(relativePath), "utf8");
    return cleanText(raw);
  } catch {
    return "";
  }
}

function humanizeFromFilename(filePath: string): string {
  const baseName = path.basename(filePath, path.extname(filePath));
  let humanized = baseName
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+([a-z])/g, (_, letter: string) => ` ${letter.toUpperCase()}`);
  
  // Clean path prefixes
  humanized = humanized.replace(/^[a-zA-Z]:\\|papers\\+/i, "");
  humanized = humanized.replace(/^[a-zA-Z0-9_\-\.]+[\\\/]+/g, "");
  
  return cleanTitle(humanized);
}

function splitAuthors(rawAuthors: string): string[] {
  const normalized = cleanText(rawAuthors);

  if (!normalized || normalized === "unknown author") {
    return [];
  }

  // Clean each author name
  const authors = normalized
    .split(/[;]|, and | and |, ?(?:et\.?\s*al\.?|al\.?)/i)
    .map((author) => cleanAuthorName(author.trim()))
    .filter((author) => author.length > 2 && author !== "Unknown");

  return authors;
}

function inferPublicationType(title: string, doi: string): PaperArtifact["publicationType"] {
  const searchable = `${title} ${doi}`.toLowerCase();

  if (searchable.includes("arxiv") || searchable.includes("preprint") || searchable.includes(" preprint")) {
    return "Preprint";
  }

  if (searchable.includes("survey") || searchable.includes("review") || searchable.includes("survey of")) {
    return "Journal Article";
  }

  if (
    searchable.includes("proceeding") ||
    searchable.includes("conference") ||
    searchable.includes("workshop") ||
    searchable.includes("symposium") ||
    searchable.startsWith("10.1109") ||
    searchable.includes(" ieee ")
  ) {
    return "Proceedings Article";
  }

  if (searchable.includes("chapter")) {
    return "Book Chapter";
  }

  if (searchable.includes("posted")) {
    return "Posted Content";
  }

  return "Journal Article";
}

function inferTags(title: string, abstract: string): string[] {
  const searchable = `${title} ${abstract}`.toLowerCase();
  
  const tagMappings: Array<[string, string]> = [
    // Primary tech tags (order matters - more specific first)
    ["reinforcement learning", "Reinforcement Learning"],
    ["machine learning", "Machine Learning"],
    ["deep learning", "Machine Learning"],
    ["neural network", "Machine Learning"],
    ["tinyml", "TinyML"],
    ["edge computing", "Edge Computing"],
    ["edge ai", "Edge Computing"],
    ["fog computing", "Fog Computing"],
    ["fog-based", "Fog Computing"],
    ["cloud computing", "Cloud Integration"],
    ["cloud-based", "Cloud Integration"],
    ["uav", "UAV"],
    ["unmanned aerial", "UAV"],
    ["drone", "UAV"],
    ["lora", "LoRa"],
    ["lorawan", "LoRa"],
    ["lpwan", "LPWAN"],
    ["nb-iot", "LPWAN"],
    ["nbiot", "LPWAN"],
    ["5g", "5G"],
    ["sensor fusion", "Sensor Fusion"],
    ["iot", "IoT"],
    ["internet of things", "IoT"],
    // Application tags
    ["irrigat", "Smart Irrigation"],
    ["irrigation", "Smart Irrigation"],
    ["crop monitor", "Crop Monitoring"],
    ["crop disease", "Crop Monitoring"],
    ["livestock", "Livestock"],
    ["precision agricultur", "Precision Agriculture"],
    ["smart agricultur", "Precision Agriculture"],
    ["agricultur", "Precision Agriculture"],
    // Quality tags
    ["anomal", "Anomaly Detection"],
    ["anomaly detection", "Anomaly Detection"],
    ["energy efficient", "Energy Efficiency"],
    ["battery-powered", "Energy Efficiency"],
    ["power consumption", "Energy Efficiency"],
    ["embedded system", "Embedded Systems"],
    ["microcontroller", "Embedded Systems"],
    ["esp32", "Embedded Systems"],
    ["raspberry pi", "Embedded Systems"],
  ];

  const foundTags = new Set<string>();
  
  for (const [needle, tag] of tagMappings) {
    if (searchable.includes(needle)) {
      foundTags.add(tag);
    }
  }

  const result = Array.from(foundTags);
  
  if (result.length === 0) {
    result.push("Precision Agriculture");
  }

  return result.slice(0, 6);
}

function getReadTime(pages: number, abstract: string): number {
  const abstractWords = abstract.split(/\s+/).length;
  const abstractBasedEstimate = Math.max(2, Math.round(abstractWords / 200));
  return Math.max(3, Math.round(pages * 1.5), abstractBasedEstimate);
}

function getHeatScore(year: number, pages: number, tags: string[]): number {
  const currentYear = new Date().getFullYear();
  const ageBonus = Math.max(0, currentYear - year);
  const pagesBonus = Math.min(20, pages * 1.5);
  const tagsBonus = Math.min(18, tags.length * 3);
  
  const score = 50 + pagesBonus + tagsBonus - Math.min(20, ageBonus);
  return Math.max(30, Math.min(95, Math.round(score)));
}

function buildKeyClaims(
  title: string,
  pages: number,
  charsExtracted: number,
  doi: string,
  abstract: string,
  introExcerpt: string,
  authors: string[]
): string[] {
  const claims: string[] = [];

  if (abstract && abstract.length > 50) {
    claims.push(`This paper presents research findings on ${title.toLowerCase().replace(/[.,]/g, "")}. The abstract provides a summary of the methodology and key contributions.`);
  } else {
    claims.push(`Research extract available for ${title}. The full paper content has been processed and is searchable.`);
  }

  if (introExcerpt && introExcerpt.length > 50) {
    claims.push(`The introduction establishes context for ${authors.length > 0 ? `research by ${authors[0]}${authors.length > 1 ? ` et al.` : ""}` : "this study"}, framing the problem space and objectives.`);
  } else {
    claims.push(`The paper covers ${pages || "multiple"} pages with approximately ${charsExtracted?.toLocaleString() || "thousands"} characters of extracted content.`);
  }

  if (doi) {
    claims.push(`Full citation available via DOI: ${doi}. The paper can be accessed for complete methodology and results.`);
  } else {
    claims.push(`Complete metadata processing applied to the research extract. DOI will be added when available.`);
  }

  if (authors.length > 0) {
    claims.push(`Attribution to ${authors.slice(0, 3).join(", ")}${authors.length > 3 ? ` and ${authors.length - 3} others` : ""}. Author affiliations can be found in the full text extract.`);
  }

  return claims;
}

function buildExperiments(title: string, tags: string[], introExcerpt: string): ExperimentIdea[] {
  const coreTags = tags.slice(0, 3);
  const focus = introExcerpt ? truncateText(introExcerpt, 100) : "this research";

  return [
    {
      id: `exp-${title.substring(0, 20)}-1`,
      title: `Synthesize editorial summary for this paper`,
      description: `Create a research note covering the problem statement, methodology, and key findings from ${focus}. Focus on practical implications for precision agriculture applications.`,
      difficulty: "medium",
      tags: coreTags,
    },
    {
      id: `exp-${title.substring(0, 20)}-2`,
      title: `Compare with related papers in collection`,
      description: `Analyze ${title} against similar papers to identify research trends, methodological differences, and potential gaps in the literature.`,
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
  const authorDisplay = authors.length > 0 
    ? `${authors.slice(0, 3).join(", ")}${authors.length > 3 ? " et al." : ""}`
    : "Authors under review";
  
  const sections: ArtifactSection[] = [
    {
      id: `snapshot-${title.substring(0, 20)}`,
      type: "markdown",
      title: "Paper Overview",
      content: `## ${title}

**${authorDisplay}**

This research extract has been processed for the AgriSense collection. Below is a structured overview of the paper content.

### Metadata
- **Source**: PDF Extract from ${row.file}
- **Pages**: ${pages || "Unknown"}
- **Characters Extracted**: ${charsExtracted?.toLocaleString() || "Unknown"}
- **DOI**: ${row.doi || "Not provided"}
${keywords.length > 0 ? `- **Keywords**: ${keywords.join(", ")}` : ""}

### Content Preview
${abstract 
  ? `**Abstract**: ${truncateText(abstract, 400)}`
  : "**Abstract**: Not available in extract. See full text below."}

${introExcerpt && introExcerpt !== abstract 
  ? `**Opening Statement**: ${truncateText(introExcerpt, 300)}`
  : ""}`,
    },
  ];

  // Add full extract section
  if (textExtract && textExtract.length > 100) {
    sections.push({
      id: `text-${title.substring(0, 20)}`,
      type: "markdown",
      title: "Full Text Extract",
      content: `## Extracted Content

The following text has been extracted from the original PDF and processed for readability.

---

${truncateText(textExtract, 3000)}

${textExtract.length > 3000 ? "\n\n*Note: Full extract available. Scroll to view complete content.*" : ""}`,
    });
  }

  return sections;
}

async function toPaperArtifact(row: ManifestRow): Promise<PaperArtifact> {
  const manifestTitle = cleanTitle(row.title);
  const textExtract = await readTextExtract(row.text_file);
  const metadata = await readExtractMetadata(row.metadata_file);
  const humanizedTitle = humanizeFromFilename(row.file);

  // Try multiple sources for title
  const extractedTitle = deriveTitleFromText(textExtract);
  const metadataTitle = cleanTitle(metadata.Title || metadata.title || "");
  
  const title = 
    (!isPlaceholderTitle(manifestTitle) && manifestTitle.length > 10) ? manifestTitle :
    (extractedTitle && extractedTitle.length > 10) ? extractedTitle :
    (!isPlaceholderTitle(metadataTitle) && metadataTitle.length > 10) ? metadataTitle :
    humanizedTitle;

  const year = parseInt(row.year, 10) || new Date().getFullYear();
  const pages = parseInt(row.pages, 10) || 0;
  const charsExtracted = parseInt(row.chars_extracted, 10) || 0;
  
  // Extract and clean abstract
  const manifestAbstract = cleanAbstract(row.abstract);
  const textAbstract = extractAbstractFromText(textExtract);
  const abstract = textAbstract || manifestAbstract;
  
  const publicationType = inferPublicationType(title, row.doi);
  const tags = inferTags(title, abstract);
  
  // Extract authors
  const parsedAuthors = extractAuthorsFromText(textExtract, title);
  const manifestAuthors = splitAuthors(row.authors);
  const metadataAuthors = splitAuthors(metadata.Author || metadata.author || "");
  
  const authors = 
    (parsedAuthors.length > 0 && !parsedAuthors.every(a => a === "Unknown")) ? parsedAuthors :
    (metadataAuthors.length > 0) ? metadataAuthors :
    (manifestAuthors.length > 0) ? manifestAuthors :
    ["Unknown Author"];
  
  const introExcerpt = extractIntroExcerpt(textExtract);
  const keywords = extractKeywordsFromText(textExtract);
  
  const summary = generateSummary(abstract, 280) || `Research summary for ${title}.`;
  
  // Clean up DOI
  const doi = row.doi?.replace(/^https?:\/\/doi\.org\//i, "").trim() || undefined;

  return {
    id: path.basename(row.metadata_file, path.extname(row.metadata_file)),
    title,
    authors,
    year,
    publicationType,
    abstract: abstract || `Research extract for ${title}.`,
    summary,
    whyItMatters: abstract 
      ? `This paper presents findings relevant to precision agriculture. ${generateSummary(abstract, 200)}`
      : `Extract available for research review. Full synthesis pending.`,
    tags,
    category: publicationType,
    heatScore: getHeatScore(year, pages, tags),
    readTime: getReadTime(pages, abstract),
    keyClaims: buildKeyClaims(title, pages, charsExtracted, doi || "", abstract, introExcerpt, authors),
    experiments: buildExperiments(title, tags, introExcerpt),
    sections: buildSections(row, title, authors, pages, charsExtracted, abstract, introExcerpt, keywords, textExtract),
    relatedPapers: [] satisfies RelatedPaper[],
    source: "pdf_extracts",
    doi,
  };
}

export async function loadExtractedPaperArtifacts(): Promise<PaperArtifact[]> {
  const manifestText = await fs.readFile(MANIFEST_PATH, "utf8");
  const rows = parseCsv(manifestText);

  if (rows.length < 2) {
    return [];
  }

  const [headerRow, ...dataRows] = rows;

  const artifacts = await Promise.all(
    dataRows
      .filter((row) => row.length > 0 && row.some((field) => field.trim().length > 0))
      .map(async (row) => {
        const record = headerRow.reduce<Partial<ManifestRow>>((acc, header, index) => {
          acc[header as keyof ManifestRow] = row[index] ?? "";
          return acc;
        }, {});

        try {
          return await toPaperArtifact(record as ManifestRow);
        } catch (error) {
          console.error(`Failed to process paper: ${record.title}`, error);
          return null;
        }
      })
  );

  // Filter out failed artifacts
  return artifacts.filter((a): a is PaperArtifact => a !== null);
}
