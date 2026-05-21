import csv
import re
import unicodedata
from collections import Counter
from pathlib import Path


INPUT = Path("clean_research_papers.csv")
OUTPUT = Path("cleaned_research_papers.csv")
DOCS = Path("DATASET_DOCS.md")


ASCII_REPLACEMENTS = {
    "\u00a0": " ",
    "\u2010": "-",
    "\u2011": "-",
    "\u2012": "-",
    "\u2013": "-",
    "\u2014": "-",
    "\u2018": "'",
    "\u2019": "'",
    "\u201c": '"',
    "\u201d": '"',
    "\u2022": "*",
    "\ufeff": "",
}

MOJIBAKE_REPLACEMENTS = {
    "â€‘": "-",
    "â€™": "'",
    "â€˜": "'",
    "â€œ": '"',
    "â€\x9d": '"',
    "â€“": "-",
    "â€”": "-",
    "â€¯": " ",
    "Â ": " ",
    "Â": "",
}

PUBLICATION_TYPE_MAP = {
    "book chapter": "Book Chapter",
    "journal article": "Journal Article",
    "posted content": "Posted Content",
    "preprint": "Preprint",
    "proceedings article": "Proceedings Article",
    "repository": "Repository",
}

RELEVANCE_TAG_MAP = {
    "highly relevant": "Highly Relevant",
    "partially relevant": "Partially Relevant",
    "low relevance": "Low Relevance",
}


def snake_case(value):
    value = unicodedata.normalize("NFKC", value.strip())
    value = re.sub(r"[^0-9A-Za-z]+", "_", value)
    return re.sub(r"_+", "_", value).strip("_").lower()


def clean_text(value):
    if value is None:
        return ""
    text = unicodedata.normalize("NFKC", str(value))
    for bad, good in MOJIBAKE_REPLACEMENTS.items():
        text = text.replace(bad, good)
    for bad, good in ASCII_REPLACEMENTS.items():
        text = text.replace(bad, good)
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"\s+([,.;:!?])", r"\1", text)
    return text.strip()


def normalize_doi(value):
    doi = clean_text(value).lower()
    doi = re.sub(r"^https?://(dx\.)?doi\.org/", "", doi)
    doi = re.sub(r"^doi:\s*", "", doi)
    return doi.strip().rstrip(".")


def normalize_year(value):
    year = clean_text(value)
    if re.fullmatch(r"\d{4}", year):
        return year
    match = re.search(r"\b(19|20)\d{2}\b", year)
    return match.group(0) if match else ""


def normalize_score(value):
    score = clean_text(value)
    try:
        number = int(float(score))
    except ValueError:
        return ""
    return str(max(0, min(100, number)))


def normalize_link(value):
    link = clean_text(value)
    if not link:
        return ""
    if link.startswith("/pdf/"):
        return link
    if re.match(r"^https?://", link, flags=re.I):
        return link
    return link


def normalize_row(row):
    normalized = {snake_case(key): clean_text(value) for key, value in row.items()}
    normalized["title"] = clean_text(normalized.get("title", ""))
    normalized["year"] = normalize_year(normalized.get("year", ""))
    normalized["doi"] = normalize_doi(normalized.get("doi", ""))
    publication_type = normalized.get("publication_type", "").lower()
    normalized["publication_type"] = PUBLICATION_TYPE_MAP.get(
        publication_type, normalized.get("publication_type", "")
    )
    normalized["authors"] = clean_text(normalized.get("authors", ""))
    normalized["abstract"] = clean_text(normalized.get("abstract", ""))
    normalized["relevance_score"] = normalize_score(normalized.get("relevance_score", ""))
    relevance_tag = normalized.get("relevance_tag", "").lower()
    normalized["relevance_tag"] = RELEVANCE_TAG_MAP.get(
        relevance_tag, normalized.get("relevance_tag", "")
    )
    normalized["source"] = snake_case(normalized.get("source", ""))
    normalized["link"] = normalize_link(normalized.get("link", ""))
    return normalized


def read_rows(path):
    with path.open(newline="", encoding="utf-8-sig") as handle:
        reader = csv.DictReader(handle)
        rows = [normalize_row(row) for row in reader]
        headers = [snake_case(header) for header in reader.fieldnames or []]
    return headers, rows


def write_csv(path, headers, rows):
    seen = set()
    unique_rows = []
    for row in rows:
        key = tuple(row.get(header, "") for header in headers)
        if key not in seen:
            seen.add(key)
            unique_rows.append(row)

    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=headers, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(unique_rows)
    return unique_rows


def docs_for(headers, original_rows, cleaned_rows):
    missing_by_column = {
        header: sum(1 for row in cleaned_rows if not row.get(header, ""))
        for header in headers
    }
    unique_by_column = {
        header: len({row.get(header, "") for row in cleaned_rows})
        for header in headers
    }
    source_counts = Counter(row.get("source", "") for row in cleaned_rows)
    tag_counts = Counter(row.get("relevance_tag", "") for row in cleaned_rows)
    type_counts = Counter(row.get("publication_type", "") for row in cleaned_rows)
    duplicate_count = len(original_rows) - len(cleaned_rows)

    column_definitions = {
        "title": "Paper or resource title.",
        "year": "Publication year, normalized to YYYY when available.",
        "doi": "Digital Object Identifier, lowercased and stripped of DOI URL prefixes.",
        "publication_type": "Publication category from the source metadata.",
        "authors": "Comma-separated author names as provided by the source.",
        "abstract": "Paper abstract or source-provided description.",
        "relevance_score": "Integer relevance score on a 0-100 scale.",
        "relevance_tag": "Categorical relevance label.",
        "relevance_reasoning": "Explanation for the relevance score and tag.",
        "short_summary": "Short synthesized paper summary where available.",
        "key_contributions": "Source-derived or synthesized contribution notes where available.",
        "project_relevance": "Notes about relevance to the AgroSense project where available.",
        "source": "Origin of the record, normalized to snake_case.",
        "link": "URL or local PDF path where available.",
    }

    sample_rows = cleaned_rows[:3]
    lines = [
        "# Research Papers Dataset Documentation",
        "",
        "## Dataset Overview",
        "",
        f"- Original file: `{INPUT.name}`",
        f"- Cleaned file: `{OUTPUT.name}`",
        f"- Rows: {len(cleaned_rows)}",
        f"- Columns: {len(headers)}",
        f"- Duplicate full rows removed: {duplicate_count}",
        "",
        "## Column Definitions",
        "",
        "| Column | Definition | Missing | Unique values |",
        "|---|---|---:|---:|",
    ]
    for header in headers:
        definition = column_definitions.get(header, "Dataset field.")
        lines.append(
            f"| `{header}` | {definition} | {missing_by_column[header]} | {unique_by_column[header]} |"
        )

    lines.extend(
        [
            "",
            "## Data Quality Issues Found",
            "",
            "- No duplicate full rows were present in the source file.",
            "- Unicode punctuation and spacing were normalized to ASCII-friendly text.",
            "- Blank metadata remains blank when the source did not provide a reliable value.",
            f"- Missing DOI values: {missing_by_column.get('doi', 0)}",
            f"- Missing link values: {missing_by_column.get('link', 0)}",
            f"- Missing abstract values: {missing_by_column.get('abstract', 0)}",
            f"- Missing short summary values: {missing_by_column.get('short_summary', 0)}",
            f"- Missing key contribution values: {missing_by_column.get('key_contributions', 0)}",
            f"- Missing project relevance values: {missing_by_column.get('project_relevance', 0)}",
            "",
            "## Normalization Applied",
            "",
            "- Headers converted to `snake_case`.",
            "- Duplicate whitespace collapsed.",
            "- Curly quotes, non-breaking hyphens, en dashes, and non-breaking spaces converted to plain ASCII equivalents.",
            "- DOI URL prefixes removed and DOI values lowercased.",
            "- `source` values normalized to `snake_case`.",
            "- `relevance_score` values clamped to integer values between 0 and 100.",
            "- `publication_type` and `relevance_tag` casing standardized.",
            "",
            "## Value Distributions",
            "",
            "### Relevance Tags",
            "",
        ]
    )
    for value, count in tag_counts.most_common():
        lines.append(f"- {value or 'Missing'}: {count}")
    lines.extend(["", "### Publication Types", ""])
    for value, count in type_counts.most_common():
        lines.append(f"- {value or 'Missing'}: {count}")
    lines.extend(["", "### Sources", ""])
    for value, count in source_counts.most_common():
        lines.append(f"- {value or 'Missing'}: {count}")

    lines.extend(
        [
            "",
            "## Example Rows",
            "",
            "| Title | Year | Relevance | Source |",
            "|---|---:|---|---|",
        ]
    )
    for row in sample_rows:
        title = row.get("title", "").replace("|", "\\|")
        lines.append(
            f"| {title} | {row.get('year', '')} | {row.get('relevance_tag', '')} ({row.get('relevance_score', '')}) | {row.get('source', '')} |"
        )

    lines.extend(
        [
            "",
            "## Suggested Normalized Schema",
            "",
            "- `papers`: `paper_id`, `title`, `year`, `doi`, `publication_type`, `abstract`, `source`, `link`",
            "- `paper_authors`: `paper_id`, `author_order`, `author_name`",
            "- `paper_relevance`: `paper_id`, `relevance_score`, `relevance_tag`, `relevance_reasoning`, `short_summary`, `key_contributions`, `project_relevance`",
        ]
    )
    return "\n".join(lines) + "\n"


def main():
    headers, rows = read_rows(INPUT)
    cleaned_rows = write_csv(OUTPUT, headers, rows)
    DOCS.write_text(docs_for(headers, rows, cleaned_rows), encoding="utf-8")
    print(f"Wrote {OUTPUT} with {len(cleaned_rows)} rows and {len(headers)} columns.")
    print(f"Wrote {DOCS}.")


if __name__ == "__main__":
    main()
