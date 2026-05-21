# Research Papers Dataset Documentation

## Dataset Overview

- Original file: `clean_research_papers.csv`
- Cleaned file: `cleaned_research_papers.csv`
- Rows: 94
- Columns: 14
- Duplicate full rows removed: 0

## Column Definitions

| Column | Definition | Missing | Unique values |
|---|---|---:|---:|
| `title` | Paper or resource title. | 0 | 93 |
| `year` | Publication year, normalized to YYYY when available. | 7 | 9 |
| `doi` | Digital Object Identifier, lowercased and stripped of DOI URL prefixes. | 20 | 75 |
| `publication_type` | Publication category from the source metadata. | 7 | 7 |
| `authors` | Comma-separated author names as provided by the source. | 6 | 89 |
| `abstract` | Paper abstract or source-provided description. | 11 | 83 |
| `relevance_score` | Integer relevance score on a 0-100 scale. | 0 | 46 |
| `relevance_tag` | Categorical relevance label. | 0 | 3 |
| `relevance_reasoning` | Explanation for the relevance score and tag. | 0 | 94 |
| `short_summary` | Short synthesized paper summary where available. | 75 | 20 |
| `key_contributions` | Source-derived or synthesized contribution notes where available. | 75 | 19 |
| `project_relevance` | Notes about relevance to the AgroSense project where available. | 75 | 16 |
| `source` | Origin of the record, normalized to snake_case. | 0 | 4 |
| `link` | URL or local PDF path where available. | 27 | 68 |

## Data Quality Issues Found

- No duplicate full rows were present in the source file.
- Unicode punctuation and spacing were normalized to ASCII-friendly text.
- Blank metadata remains blank when the source did not provide a reliable value.
- Missing DOI values: 20
- Missing link values: 27
- Missing abstract values: 11
- Missing short summary values: 75
- Missing key contribution values: 75
- Missing project relevance values: 75

## Normalization Applied

- Headers converted to `snake_case`.
- Duplicate whitespace collapsed.
- Curly quotes, non-breaking hyphens, en dashes, and non-breaking spaces converted to plain ASCII equivalents.
- DOI URL prefixes removed and DOI values lowercased.
- `source` values normalized to `snake_case`.
- `relevance_score` values clamped to integer values between 0 and 100.
- `publication_type` and `relevance_tag` casing standardized.

## Value Distributions

### Relevance Tags

- Low Relevance: 56
- Partially Relevant: 32
- Highly Relevant: 6

### Publication Types

- Journal Article: 48
- Preprint: 19
- Proceedings Article: 12
- Missing: 7
- Repository: 3
- Book Chapter: 3
- Posted Content: 2

### Sources

- scispace: 38
- scispace_full_text: 28
- arxiv: 19
- google_scholar: 9

## Example Rows

| Title | Year | Relevance | Source |
|---|---:|---|---|
| Intelligent and Efficient IoT Through the Cooperation of TinyML and Edge Computing | 2024 | Highly Relevant (76) | scispace |
| Implementation of smart security system in agriculture fields using embedded machine learning | 2023 | Partially Relevant (56) | scispace |
| Simulating Battery-Powered TinyML Systems Optimised using Reinforcement Learning in Image-Based Anomaly Detection | 2024 | Partially Relevant (53) | arxiv |

## Suggested Normalized Schema

- `papers`: `paper_id`, `title`, `year`, `doi`, `publication_type`, `abstract`, `source`, `link`
- `paper_authors`: `paper_id`, `author_order`, `author_name`
- `paper_relevance`: `paper_id`, `relevance_score`, `relevance_tag`, `relevance_reasoning`, `short_summary`, `key_contributions`, `project_relevance`
