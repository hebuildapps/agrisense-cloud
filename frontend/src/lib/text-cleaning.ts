/**
 * Text Cleaning Pipeline for PDF Extracts
 * 
 * Fixes common issues in OCR/text extraction:
 * - Random spaces between characters and words
 * - Broken sentence flow
 * - Artificial line breaks from PDF parsing
 * - Unicode/encoding issues
 * - Malformed paths/slashes in titles
 */

import type { ArtifactSection } from "@/types/artifact";

/**
 * Fix random spaces inserted by broken OCR
 * Pattern: single character followed by space, then rest of word
 * e.g., "p recision" -> "precision"
 */
function fixRandomSpaces(text: string): string {
  // Fix obvious OCR fragments such as "p recision" -> "precision" or "w orld" -> "world".
  // Keep legitimate single-letter words like "a" and "i" intact.
  return text.replace(/\b([a-z])\s+([a-z][a-zA-Z]{1,11})\b/g, (match, left, right) => {
    if (left === "a" || left === "i" || left === "o") {
      return match;
    }

    return `${left}${right}`;
  });
}

/**
 * Fix double spaces that appear in broken OCR
 */
function fixDoubleSpaces(text: string): string {
  return text.replace(/\s{2,}/g, " ");
}

/**
 * Fix hyphenation at line breaks (common in PDF text extraction)
 * e.g., "automat-\nically" -> "automatically"
 */
function fixHyphenation(text: string): string {
  return text.replace(/([a-zA-Z])-\s*\n\s*([a-zA-Z])/g, "$1$2");
}

/**
 * Fix broken words at line endings
 * e.g., "appro-\npriate" -> "appropriate"
 */
function fixBrokenWords(text: string): string {
  return text.replace(/([a-zA-Z])-\n([a-zA-Z])/g, "$1$2");
}

/**
 * Remove page markers and section separators
 */
function removePageMarkers(text: string): string {
  return text
    // Remove "--- Page X ---" markers
    .replace(/---+\s*Page\s*\d+\s*---+/gi, "")
    // Remove "Page X of Y" patterns
    .replace(/Page\s+\d+\s+(?:of\s+)?\d+/gi, "")
    // Remove "X / Y" page indicators
    .replace(/\d+\s*\/\s*\d+/g, "")
    // Remove standalone page numbers
    .replace(/\n\s*(\d+)\s*\n/g, "\n\n");
}

/**
 * Normalize line endings and fix artificial line breaks
 * Real paragraphs end with punctuation; artificial breaks don't
 */
function fixLineBreaks(text: string): string {
  // First, normalize all line endings to \n
  const normalized = text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n");

  // Split into lines
  const lines = normalized.split("\n");

  // Join lines based on whether they end with sentence-ending punctuation
  const result: string[] = [];
  let currentParagraph = "";

  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Skip empty lines
    if (!trimmedLine) {
      if (currentParagraph) {
        result.push(currentParagraph);
        currentParagraph = "";
      }
      continue;
    }

    // Check if line ends with sentence-ending punctuation
    const endsWithSentence = /[.!?:;]\s*$/.test(trimmedLine);
    const isShortLine = trimmedLine.length < 30; // Probably a heading or incomplete
    const isHeaderLike = /^[A-Z\s]+$/.test(trimmedLine) && trimmedLine.length < 60; // ALL CAPS header

    if (endsWithSentence || isShortLine || isHeaderLike) {
      // This line ends a thought, keep it separate or join
      if (currentParagraph) {
        // If current paragraph exists and this is short, it's probably a continuation
        if (isShortLine && !endsWithSentence) {
          currentParagraph += " " + trimmedLine;
        } else {
          result.push(currentParagraph);
          currentParagraph = trimmedLine;
        }
      } else {
        currentParagraph = trimmedLine;
      }
    } else {
      // Continue the paragraph
      if (currentParagraph) {
        currentParagraph += " " + trimmedLine;
      } else {
        currentParagraph = trimmedLine;
      }
    }
  }

  // Don't forget the last paragraph
  if (currentParagraph) {
    result.push(currentParagraph);
  }

  return result.join("\n\n");
}

/**
 * Fix encoding issues and normalize Unicode
 */
function normalizeUnicode(text: string): string {
  return text
    // Fix common OCR Unicode issues
    .replace(/[�]/g, "-") // Replacement character
    // Normalize quotes
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    // Fix em/en dashes
    .replace(/–/g, "-")
    .replace(/—/g, "-")
    // Normalize spaces around punctuation
    .replace(/\s+([.,;:!?])/g, "$1")
    .replace(/([.,;:!?])(?=[a-zA-Z])/g, "$1 ")
    // Remove non-breaking spaces
    .replace(/\u00A0/g, " ")
    // Fix common OCR character swaps
    .replace(/\|/g, "l") // Pipe to l
    .replace(/0(?=[a-zA-Z])/g, "O") // Zero to O in some contexts
    .replace(/1(?=[a-zA-Z]{2,})/g, "l"); // One to l in some contexts
}

/**
 * Clean malformed paths and file references
 * e.g., "papers\filename" -> "filename"
 */
function cleanPathReferences(text: string): string {
  return text
    // Fix backslash paths at start
    .replace(/^[a-zA-Z]:\\[\\a-zA-Z0-9_\s-]+/gm, (match) => {
      // Extract the filename from path
      const parts = match.split(/[\\\/]/);
      return parts[parts.length - 1] || match;
    })
    // Fix "papers\..." patterns
    .replace(/papers\\+/g, "")
    // Fix multiple backslashes
    .replace(/\\{2,}/g, " ")
    // Fix forward slash paths
    .replace(/\/+/g, " / ")
    .replace(/\s\/\s/g, " / ");
}

/**
 * Fix titles that have path-like prefixes
 */
export function cleanTitle(title: string): string {
  let cleaned = title;
  
  // Remove file path patterns
  cleaned = cleaned.replace(/^[a-zA-Z]:\\[\\a-zA-Z0-9_\s-]+\\[\\a-zA-Z0-9_\s-]+\\$/gm, "");
  cleaned = cleaned.replace(/^papers[\\\/]+/i, "");
  cleaned = cleaned.replace(/^[a-zA-Z0-9_.-]+[\\\/]+/g, "");
  
  // Replace underscores and hyphens with spaces in titles
  // But preserve if it's a known acronym
  const acronyms = ["IoT", "UAV", "ML", "AI", "5G", "LPWAN", "LoRa", "TinyML"];
  cleaned = cleaned.replace(/_/g, " ");
  
  // Title case each word but preserve acronyms
  cleaned = cleaned
    .split(" ")
    .map((word, index) => {
      // Keep acronyms as-is
      if (acronyms.some(ac => word.toUpperCase() === ac)) {
        return word.toUpperCase();
      }
      // Title case first word and words after colons
      if (index === 0 || word.endsWith(":")) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }
      return word.toLowerCase();
    })
    .join(" ");
  
  // Clean up multiple spaces
  cleaned = cleaned.replace(/\s{2,}/g, " ").trim();
  
  return cleaned;
}

/**
 * Clean and normalize author names
 */
export function cleanAuthorName(author: string): string {
  // Remove email addresses
  let cleaned = author.replace(/<[^>]+>/g, "").trim();
  cleaned = cleaned.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "").trim();
  
  // Remove affiliations
  const affiliationTerms = [
    "Faculty of", "University of", "Department of", "School of",
    "Institute of", "Laboratory of", "Center for", "College of",
    "Research", "Engineering", "Technology", "Science"
  ];
  
  for (const term of affiliationTerms) {
    cleaned = cleaned.replace(new RegExp(`\\s*[,;-]?\\s*${term}\\s+[a-zA-Z0-9\\s,;-]+`, "gi"), "");
  }
  
  // Remove location info
  cleaned = cleaned.replace(/,\s*[A-Z][a-zA-Z\s]+$/g, "").trim();
  cleaned = cleaned.replace(/\s+[A-Z]{2}\s+\d{5}/g, "").trim(); // State + zip
  
  // Fix spacing
  cleaned = cleaned.replace(/\s{2,}/g, " ").trim();
  
  // Title case
  cleaned = cleaned
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
  
  return cleaned || "Unknown Author";
}

/**
 * Clean abstract text specifically
 * Abstracts should flow naturally and be readable
 */
export function cleanAbstract(text: string): string {
  if (!text) return "";
  
  let cleaned = text;
  
  // Apply all general cleaning
  cleaned = fixRandomSpaces(cleaned);
  cleaned = fixDoubleSpaces(cleaned);
  cleaned = fixHyphenation(cleaned);
  cleaned = fixBrokenWords(cleaned);
  cleaned = normalizeUnicode(cleaned);
  
  // Remove page markers
  cleaned = removePageMarkers(cleaned);
  
  // Fix line breaks for flowing text
  cleaned = fixLineBreaks(cleaned);
  
  // Ensure proper sentence spacing
  cleaned = cleaned.replace(/([.!?])\s*([a-zA-Z])/g, "$1 $2");
  
  // Remove trailing/leading whitespace from each line
  cleaned = cleaned.split("\n").map(line => line.trim()).join("\n");
  
  // Clean up multiple blank lines
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");
  
  return cleaned.trim();
}

/**
 * Clean extracted paper text while preserving real word spacing.
 * This avoids over-aggressive OCR repairs that merge adjacent words.
 */
export function cleanExtractText(text: string): string {
  if (!text) return "";

  let cleaned = text;

  cleaned = cleaned.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  cleaned = removePageMarkers(cleaned);
  cleaned = fixHyphenation(cleaned);
  cleaned = fixBrokenWords(cleaned);
  cleaned = fixLineBreaks(cleaned);
  cleaned = normalizeUnicode(cleaned);
  cleaned = fixDoubleSpaces(cleaned);
  cleaned = cleanPathReferences(cleaned);

  return cleaned.trim();
}

/**
 * Main text cleaning function - applies full pipeline
 */
export function cleanText(text: string): string {
  if (!text) return "";
  
  let cleaned = text;
  
  // Step 1: Basic normalization
  cleaned = cleaned.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  
  // Step 2: Remove page markers
  cleaned = removePageMarkers(cleaned);
  
  // Step 3: Fix hyphenation at line breaks
  cleaned = fixHyphenation(cleaned);
  cleaned = fixBrokenWords(cleaned);
  
  // Step 4: Fix random OCR spaces
  cleaned = fixRandomSpaces(cleaned);
  
  // Step 5: Fix line breaks based on sentence structure
  cleaned = fixLineBreaks(cleaned);
  
  // Step 6: Normalize Unicode and encoding
  cleaned = normalizeUnicode(cleaned);
  
  // Step 7: Fix double spaces
  cleaned = fixDoubleSpaces(cleaned);
  
  // Step 8: Clean path references
  cleaned = cleanPathReferences(cleaned);
  
  // Step 9: Final cleanup
  cleaned = cleaned.trim();
  
  return cleaned;
}

/**
 * Format extracted text into readable paragraphs
 */
export function formatAsParagraphs(text: string, maxLineLength: number = 80): string {
  const cleaned = cleanText(text);
  const lines = cleaned.split("\n");
  const paragraphs: string[] = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      // Add spacing between paragraph blocks
      if (paragraphs.length > 0 && paragraphs[paragraphs.length - 1] !== "") {
        paragraphs.push("");
      }
    } else if (trimmed.length < maxLineLength) {
      paragraphs.push(trimmed);
    } else {
      // Word wrap long lines
      const words = trimmed.split(" ");
      let currentLine = "";
      
      for (const word of words) {
        if ((currentLine + " " + word).trim().length <= maxLineLength) {
          currentLine = (currentLine + " " + word).trim();
        } else {
          if (currentLine) {
            paragraphs.push(currentLine);
          }
          currentLine = word;
        }
      }
      
      if (currentLine) {
        paragraphs.push(currentLine);
      }
    }
  }
  
  return paragraphs.filter(p => p.length > 0).join("\n\n");
}

/**
 * Truncate text to a maximum length with ellipsis
 */
export function truncateText(text: string, maxLength: number, suffix: string = "..."): string {
  if (!text || text.length <= maxLength) return text || "";
  
  // Try to break at a sentence boundary
  const truncated = text.substring(0, maxLength - suffix.length);
  const lastSentence = truncated.lastIndexOf(". ");
  
  if (lastSentence > maxLength * 0.6) {
    return truncated.substring(0, lastSentence + 1) + suffix;
  }
  
  // Fall back to word boundary
  const lastSpace = truncated.lastIndexOf(" ");
  if (lastSpace > maxLength * 0.7) {
    return truncated.substring(0, lastSpace) + suffix;
  }
  
  return truncated + suffix;
}

/**
 * Extract and clean DOI from text
 */
export function extractDOI(text: string): string | undefined {
  // Common DOI patterns
  const patterns = [
    /10\.\d{4,}\/[^\s]+/,
    /doi:\s*(10\.\d{4,}\/[^\s]+)/i,
    /https?:\/\/doi\.org\/(10\.\d{4,}\/[^\s]+)/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1] || match[0];
    }
  }
  
  return undefined;
}

/**
 * Extract year from text or metadata
 */
export function extractYear(text: string, fallback: number = new Date().getFullYear()): number {
  // Try to find a 4-digit year
  const yearMatch = text.match(/\b(19|20)\d{2}\b/);
  if (yearMatch) {
    const year = parseInt(yearMatch[0], 10);
    if (year >= 1900 && year <= new Date().getFullYear() + 1) {
      return year;
    }
  }
  return fallback;
}

/**
 * Process an ArtifactSection's content through the cleaning pipeline
 */
export function cleanSectionContent(section: ArtifactSection): ArtifactSection {
  if (section.type === "extract" || section.type === "code") {
    return section;
  }
  
  return {
    ...section,
    content: cleanText(section.content),
  };
}

/**
 * Generate a readable summary from abstract/excerpt
 */
export function generateSummary(text: string, maxLength: number = 280): string {
  const cleaned = cleanAbstract(text);
  
  if (!cleaned) {
    return "";
  }
  
  // If text is short enough, return as-is
  if (cleaned.length <= maxLength) {
    return cleaned;
  }
  
  // Find a good break point
  const truncated = cleaned.substring(0, maxLength);
  
  // Try to end at a sentence
  const lastSentence = truncated.lastIndexOf(". ");
  if (lastSentence > maxLength * 0.7) {
    return truncated.substring(0, lastSentence + 1);
  }
  
  // Try to end at a comma or semicolon
  const lastClause = truncated.lastIndexOf(", ");
  if (lastClause > maxLength * 0.8) {
    return truncated.substring(0, lastClause) + ".";
  }
  
  // End at word boundary
  const lastSpace = truncated.lastIndexOf(" ");
  if (lastSpace > maxLength * 0.9) {
    return truncated.substring(0, lastSpace) + "...";
  }
  
  return truncated + "...";
}

/**
 * Validate that text doesn't have common OCR issues
 */
export function hasOCRIssues(text: string): boolean {
  if (!text) return false;
  
  // Check for excessive random spaces
  const randomSpaceRatio = (text.match(/[a-z]\s{2,}[a-z]/gi) || []).length / text.length;
  if (randomSpaceRatio > 0.01) return true;
  
  // Check for broken words (short words at end of lines)
  if (/[a-z]\n[a-z]/.test(text)) return true;
  
  // Check for excessive line breaks in what should be a paragraph
  const lineCount = text.split("\n").length;
  const expectedLines = Math.ceil(text.length / 80);
  if (lineCount > expectedLines * 2) return true;
  
  return false;
}