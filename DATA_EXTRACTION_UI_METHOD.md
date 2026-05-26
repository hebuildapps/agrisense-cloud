# Data extraction & Frontend UI — Method of Operation

## Purpose
Concise description of how research PDFs are extracted, processed, and surfaced in the UI frontend.

## High-level workflow
- 1) Extract raw text & metadata from PDFs using scripts: [extract_pdf_corpus.py](extract_pdf_corpus.py).
- 2) Store per-document artefacts under `pdf_extracts/` as `.json` (structured metadata + text) and `.txt` (plain text). See `pdf_extracts/manifest.csv`.
- 3) Normalize and clean the extracted content using [normalize_research_papers.py](normalize_research_papers.py) and manual/automated cleaning steps producing [clean_research_papers.csv](clean_research_papers.csv) and [cleaned_research_papers.csv](cleaned_research_papers.csv).
- 4) Assemble study artifacts or derived datasets with [build_pilot_study.py](build_pilot_study.py) for downstream analysis and UI consumption.

## Data formats & locations
- Per-article JSON: `pdf_extracts/<slug>.json` — contains metadata (title, authors, year, source), extracted sections, and full text.
- Plain text: `pdf_extracts/<slug>.txt` — human-readable extraction.
- Manifest: `pdf_extracts/manifest.csv` — index of available documents and basic metadata.

Files of interest:
- [extract_pdf_corpus.py](extract_pdf_corpus.py)
- [normalize_research_papers.py](normalize_research_papers.py)
- [build_pilot_study.py](build_pilot_study.py)
- [clean_research_papers.csv](clean_research_papers.csv)
- [cleaned_research_papers.csv](cleaned_research_papers.csv)
- `pdf_extracts/` directory

## Current frontend (UI) arrangement
- Project root: `frontend/` (Next.js app). See [frontend/package.json](frontend/package.json) for scripts and deps.
- Main entry / current editing location: [frontend/src/app/page.tsx](frontend/src/app/page.tsx).
- UI component registry: [frontend/components.json](frontend/components.json) (if used for layout/component mapping).

How the frontend consumes data (current / recommended patterns):

- Static/Prebuilt mode (current common approach):
  - Pipeline exports JSON files under `pdf_extracts/` or into a `public/` subfolder during build.
  - Frontend imports or fetches those JSON files at runtime (fetch from `/pdf_extracts/<slug>.json`), enabling a purely static or Jamstack deployment.

- Dynamic/API mode (alternate / recommended for large corpora):
  - Implement Next.js API route(s) that read from `pdf_extracts/` or a backing DB and return paginated results and single-document JSON.
  - Example endpoint path (app-router): `frontend/src/app/api/docs/route.ts` (server component reading filesystem) or pages-router: `frontend/src/pages/api/docs/[slug].ts`.

## UI responsibilities & behaviors
- Document list / index: fetch manifest or paginated index, display title, authors, year, short snippet.
- Search & filter: client-side filtering for small sets; for larger sets, implement server-side search (simple text search over JSON files or a small search index such as lunr/elasticlunr).
- Document view: load full JSON for a selected doc, render sections (abstract, intro, methods, results), and enable text highlighting of search terms.
- Metadata & downloads: provide direct link to `.txt` or `.json` for each document and a download action.
- Performance: lazy-load full documents, paginate list views, and memoize parsed results.

## Data flow (UI sequence)
1. UI requests index (manifest or API) → returns list of doc records.
2. UI renders list; user selects a document.
3. UI fetches `/pdf_extracts/<slug>.json` or `/api/docs/<slug>` → displays full content and metadata.
4. Additional UI actions (search within doc, annotate, export) operate on the loaded JSON or via separate API endpoints.

## Quick dev/run commands
```powershell
cd frontend
npm install
npm run dev
```

## Next steps / recommendations
- Persist a small search index (lunr) produced during the extraction pipeline to speed searching in the UI.
- Add a lightweight Next.js API route to paginate and filter results server-side for scalability.
- Standardize the per-document JSON schema (title, authors, year, sections[], full_text) and document it near the extraction scripts.

---
_Note:_ this document summarizes the current extraction scripts and typical UI consumption patterns. If you want, I can add a small example API route and a React hook for fetching documents next.
