# Conversation Context and Work Summary

Date: 2026-05-27

This file captures the end-to-end conversation, decisions, and code changes made during the PDF extraction → frontend → AI-assistant work. It's intended as a concise context document other agents or collaborators can read before continuing work.

## Goals
- Replace the PDF extraction library with PyMuPDF (`fitz`) and keep extraction output/metadata format unchanged.
- Preserve text spacing in `.txt` extracts and keep JSON `.json` artifacts consistent.
- Ensure the Next.js frontend reads artifacts from `pdf_extracts/` and the Ask-AI modal uses artifact data (`documentData.full_text` / `documentData.sections`) rather than scraping the DOM.
- Add a real server-side AI proxy endpoint and wire the modal to call it; support multiple providers (OpenAI, Groq, Claude) and a summary mode.

## High-level outcome
- Extraction: `extract_pdf_corpus.py` now uses `fitz` for PDF text extraction; spacing fixes applied and extractor guards empty inputs.
- Frontend: `frontend/src/lib/extracted-papers.ts` reads `pdf_extracts/` (fallback from `manifest.csv` to scanning `.json` files) and constructs `PaperArtifact[]` with `documentData` (full_text and sections).
- Text cleaning: `cleanExtractText()` added to avoid merging words while trimming extraction artifacts.
- UI: `frontend/src/components/research/AskAgentModal.tsx` updated:
  - Modal reads `paper.documentData` for context.
  - Adds provider selector (OpenAI/Groq/Claude).
  - Adds two buttons in the footer: Ask (`Q` tile) and Generate Summary (`S` tile). The letter tiles use monospace font and a darker tile background.
  - Header and footer are fixed; the message area scrolls.
- API: `frontend/src/app/api/assistant/route.ts` added/extended:
  - POST { question, paperId, provider, mode }
  - Supports `openai` natively (uses `OPENAI_API_KEY`), with a distinct system prompt for `ask` and for `summary`.
  - Supports `groq` and `claude` as passthrough via configurable `GROQ_API_URL`/`GROQ_API_KEY` and `CLAUDE_API_URL`/`CLAUDE_API_KEY`. The route posts a `prompt` JSON body to those URLs; adapters may be needed for endpoint specifics.

## Key files changed or added
- `extract_pdf_corpus.py` — extractor using PyMuPDF (`fitz`) and safe manifest handling.
- `frontend/src/lib/extracted-papers.ts` — artifact loader, manifest fallback, `documentData` creation.
- `frontend/src/lib/text-cleaning.ts` — `cleanExtractText()` and safer cleaners.
- `frontend/src/components/research/AskAgentModal.tsx` — provider selector, Ask/Summary buttons, tile styling, fixed header/footer with scrollable message area, client POST to `/api/assistant`.
- `frontend/src/app/api/assistant/route.ts` — server-side AI proxy (OpenAI + passthrough for Groq/Claude), summary/ask system prompts.

## How it works (runtime)
1. The extractor writes `.txt` and `.json` artifacts to `pdf_extracts/`.
2. The Next.js server route `loadExtractedPaperArtifacts()` reads those artifacts and returns `PaperArtifact[]` (used by `/api/papers` and server-side pages).
3. The Ask-AI modal reads `paper.documentData` (server-provided) and calls `/api/assistant` with `{ question, paperId, provider, mode }`.
4. `/api/assistant` builds a scoped prompt using the artifact `documentData.full_text` (or sections) and forwards it to the chosen provider.

## Deployment checklist (required for AI to work in production)
1. Ensure you deploy the `frontend` Next.js app (API routes must be included). If deploying to Vercel, set the project root to `frontend`.
2. Add environment variables in the hosting dashboard:
   - For OpenAI: `OPENAI_API_KEY`
   - For Groq: `GROQ_API_URL`, `GROQ_API_KEY` (if using Groq)
   - For Claude: `CLAUDE_API_URL`, `CLAUDE_API_KEY` (if using Claude)
3. Re-deploy the app. The modal will call `/api/assistant` server-side so keys remain secret.

## Recommended next steps (optional enhancements)
- Add `/api/assistant/status` to report which providers are configured (so the UI can show provider availability and a more accurate "Online" indicator).
- Implement streaming responses for improved UX (server -> client streaming or SSE/websocket adapter).
- Implement provider adapters for Groq/Claude if you want tighter integration (map input/output fields to their API shapes).
- Add rate-limiting / basic usage limits on the server route to prevent accidental expensive calls.

## Quick commands
Run frontend build locally (already validated in CI/local):
```powershell
Set-Location frontend
npm run build
```

## Contact points in code
- Modal: `frontend/src/components/research/AskAgentModal.tsx`
- Server assistant API: `frontend/src/app/api/assistant/route.ts`
- Artifact loader: `frontend/src/lib/extracted-papers.ts`

---
If you'd like, I can add the `/api/assistant/status` endpoint and wire the UI Online indicator to it, or implement streaming. Which would you prefer next?

## Pending Tasks (priority order)
- **High:** Add `/api/assistant/status` to report which providers are configured; wire the modal's Online indicator to it.
- **High:** Deploy `frontend` with environment variables set: `OPENAI_API_KEY` (required), and optionally `GROQ_API_URL`/`GROQ_API_KEY`, `CLAUDE_API_URL`/`CLAUDE_API_KEY`.
- **High:** Verify Vercel/project root is `frontend` so API routes deploy.
- **Med:** Implement provider adapters for Groq and Claude (map request/response shapes for reliability instead of generic passthrough).
- **Med:** Add server-side rate-limiting and input validation to `/api/assistant` to prevent abuse and runaway costs.
- **Med:** Add simple logging/metrics for API calls and errors (file-based or external telemetry).
- **Low:** Implement streaming responses (SSE or streaming fetch) for long answers.
- **Low:** Add integration tests and CI smoke test for `/api/assistant` (mock provider or use local test keys).
- **Low:** Expand `context.md` with adapter docs and example env var formats for each provider.

