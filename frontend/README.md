# AgriSense Research — AI-Native Research Artifact Platform

An editorial-style research operating system where each research paper becomes an interactive HTML artifact. Built with Next.js, Tailwind CSS, and shadcn/ui.

## Architecture Overview

### Directory Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── globals.css          # Global styles with dark theme
│   │   ├── layout.tsx           # Root layout with serif fonts
│   │   └── page.tsx             # Main demo page
│   ├── components/
│   │   ├── ui/                  # shadcn/ui base components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── sheet.tsx
│   │   │   └── ...
│   │   └── research/            # Domain-specific components
│   │       ├── Sidebar.tsx      # Left sidebar with filters
│   │       ├── PaperArtifact.tsx # Main artifact viewer
│   │       ├── AskAgentModal.tsx # AI conversation modal
│   │       ├── HeatIndicator.tsx # Heat score display
│   │       ├── PaperCard.tsx     # Paper list cards
│   │       ├── TagFilter.tsx     # Tag filtering UI
│   │       ├── RelatedPapers.tsx # Related papers list
│   │       ├── MarkdownSection.tsx # Render markdown/diagrams
│   │       └── index.ts          # Barrel export
│   ├── data/
│   │   └── mock-artifacts.ts    # Mock paper data
│   └── types/
│       └── artifact.ts          # TypeScript interfaces
```

### Component System

#### Research Components (`/components/research/`)

| Component | Purpose |
|-----------|---------|
| **Sidebar** | Left navigation with search, tag filters, categories, trending topics, and paper list |
| **PaperArtifact** | Main content viewer rendering paper metadata, claims, experiments, and sections |
| **AskAgentModal** | AI conversation interface for paper Q&A |
| **HeatIndicator** | Visual score display (0-100) with gradient bars and color coding |
| **PaperCard** | Compact paper preview card for lists |
| **TagFilter** | Interactive tag selection with clear functionality |
| **RelatedPapers** | List of linked research papers with heat scores |
| **MarkdownSection** | Renders markdown, diagrams, code blocks, and metrics tables |

#### Base UI Components (`/components/ui/`)

shadcn/ui provides accessible base components: Button, Dialog, Sheet, Input, Textarea, Badge, Card, ScrollArea, Separator, DropdownMenu.

### Artifact Data Schema

Papers are stored as structured JSON conforming to `PaperArtifact` interface:

```typescript
interface PaperArtifact {
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
  heatScore: number;       // 0-100 interest/relevance score
  readTime: number;        // minutes
  keyClaims: string[];     // numbered claims with data
  experiments: ExperimentIdea[];
  sections: ArtifactSection[];  // markdown/diagram/code/metrics
  relatedPapers: RelatedPaper[];
  source: string;
  doi?: string;
  link?: string;
}

interface ArtifactSection {
  id: string;
  type: "markdown" | "diagram" | "code" | "metrics";
  title: string;
  content: string;  // markdown or diagram DSL
}
```

### Connecting Real Backend Data

The UI is designed to work with any JSON data source. To integrate real backend data:

1. **Replace mock data**: Update `src/data/mock-artifacts.ts` with API calls or file imports
2. **Use SWR/React Query**: Fetch artifacts server-side in Server Components
3. **Schema alignment**: Ensure your backend returns `PaperArtifact`-compatible JSON

```typescript
// Example: Server-side data loading
async function getArtifacts() {
  const res = await fetch('/api/artifacts');
  return res.json();
}
```

4. **Heat scores**: Compute from paper citations, recent downloads, or relevance to current research direction

### Visual Design

- **Editorial aesthetic**: Serif typography (Playfair Display, Source Serif 4) for titles
- **Research journal feel**: Muted backgrounds, subtle borders, numbered claims
- **Modern dark UI**: Deep backgrounds with high-contrast text
- **Heat indicators**: Gradient color scale (cool → sizzling) with animated bars
- **Whitespace**: Generous spacing following newspaper layout principles

### Features

- [x] Left sidebar with filtering
- [x] Paper list with heat scores
- [x] Tag and category filters
- [x] Search functionality
- [x] Trending topics display
- [x] Paper artifact viewer
- [x] Key claims with numbered badges
- [x] Experiment ideas with difficulty tags
- [x] Markdown/diagram/code section rendering
- [x] Related papers navigation
- [x] Ask Agent modal with mock responses
- [x] Right utility panel (placeholder for annotations/citation graph)
- [x] Mobile-responsive with sheet-based navigation
- [x] Dark mode default

### Coming Soon

- Real AI backend integration
- Annotations and highlights panel
- Citation graph visualization
- AI summarizer
- Paper collections/bookmarks
- Collaborative features

## Development

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS v4 with shadcn/ui
- **Components**: shadcn/ui base + custom research components
- **Fonts**: Playfair Display (serif), Source Serif 4 (body), Geist (sans), Geist Mono (code)
- **Dark theme**: OKLCH color space with custom scrollbar styling

## Product Direction

This platform transforms research papers into interactive HTML artifacts, enabling:

- Rapid paper discovery through heat scores and filtering
- Deep exploration of claims and experiments
- AI-assisted paper Q&A
- Research workflow organization

The design prioritizes readability and editorial elegance over dashboard aesthetics — think research journal, not analytics platform.
