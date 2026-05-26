// Core types for the research artifact platform

export interface PaperArtifact {
  id: string;
  title: string;
  authors: string[];
  year: number;
  publicationType: string;
  abstract: string;
  summary: string;
  whyItMatters: string;
  tags: string[];
  category: string;
  heatScore: number; // 0-100
  readTime: number; // minutes
  keyClaims: string[];
  experiments: ExperimentIdea[];
  sections: ArtifactSection[];
  relatedPapers: RelatedPaper[];
  source: string;
  doi?: string;
  link?: string;
  documentData?: LoadedDocumentData;
}

export interface LoadedDocumentData {
  full_text?: string;
  sections?: LoadedDocumentSection[];
}

export interface LoadedDocumentSection {
  title?: string;
  type?: string;
  content: string;
}

export interface ExperimentIdea {
  id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "advanced";
  tags: string[];
}

export interface ArtifactSection {
  id: string;
  type: "markdown" | "diagram" | "code" | "metrics" | "extract";
  title: string;
  content: string;
}

export interface RelatedPaper {
  id: string;
  title: string;
  authors: string;
  year: number;
  heatScore: number;
  tags: string[];
  reason: string;
}

export interface FilterState {
  tags: string[];
  categories: string[];
  searchQuery: string;
  heatRange: [number, number];
}

export interface ConversationMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// Available tags across all papers
export const AVAILABLE_TAGS = [
  "IoT",
  "TinyML",
  "Edge Computing",
  "Machine Learning",
  "Precision Agriculture",
  "UAV",
  "Reinforcement Learning",
  "LoRa",
  "5G",
  "LPWAN",
  "Smart Irrigation",
  "Crop Monitoring",
  "Anomaly Detection",
  "Fog Computing",
  "Energy Efficiency",
  "Cloud Integration",
  "Embedded Systems",
  "Neural Networks",
  "Sensor Fusion",
  "Autonomous Systems",
] as const;

export type Tag = (typeof AVAILABLE_TAGS)[number];

export const PAPER_CATEGORIES = [
  "Journal Article",
  "Proceedings Article",
  "Preprint",
  "Repository",
  "Book Chapter",
  "Posted Content",
] as const;

export type PaperCategory = (typeof PAPER_CATEGORIES)[number];

export const TRENDING_TOPICS = [
  { name: "TinyML in Agriculture", count: 12, trend: "rising" },
  { name: "Edge AI for Crop Health", count: 8, trend: "rising" },
  { name: "Autonomous Irrigation", count: 15, trend: "stable" },
  { name: "LoRaWAN Field Networks", count: 6, trend: "rising" },
  { name: "UAV-Ground Sensor Fusion", count: 9, trend: "stable" },
  { name: "Battery-Powered ML", count: 4, trend: "rising" },
] as const;

export type TrendingTopic = (typeof TRENDING_TOPICS)[number];
