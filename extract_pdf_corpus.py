import csv
import json
import re
import sys
from pathlib import Path


sys.path.insert(0, str(Path(".codex_deps").resolve()))

from pypdf import PdfReader  # noqa: E402


PAPERS_DIR = Path("papers")
OUT_DIR = Path("pdf_extracts")
MANIFEST = OUT_DIR / "manifest.csv"


def clean_text(text):
    text = text or ""
    text = text.encode("utf-8", errors="replace").decode("utf-8")
    text = text.replace("\x00", " ")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def safe_stem(path):
    return re.sub(r"[^A-Za-z0-9._-]+", "_", path.stem).strip("_")


def first_match(pattern, text, flags=re.I):
    match = re.search(pattern, text, flags)
    return clean_text(match.group(1)) if match else ""


def infer_year(text, metadata):
    for value in metadata.values():
        match = re.search(r"\b(19|20)\d{2}\b", str(value or ""))
        if match:
            return match.group(0)
    match = re.search(r"\b(19|20)\d{2}\b", text[:8000])
    return match.group(0) if match else ""


def infer_title(path, text, metadata):
    for key in ("/Title", "Title", "title"):
        value = clean_text(metadata.get(key, ""))
        if value and len(value) > 8 and "Microsoft Word" not in value:
            return value
    lines = [
        clean_text(line)
        for line in text.splitlines()[:60]
        if 12 <= len(clean_text(line)) <= 180
    ]
    for line in lines:
        if not re.search(r"^(abstract|keywords|introduction|www\.|http)", line, re.I):
            return line
    return path.stem.replace("_", " ")


def infer_authors(text, metadata):
    for key in ("/Author", "Author", "author"):
        value = clean_text(metadata.get(key, ""))
        if value and len(value) <= 300:
            return value
    author_block = first_match(r"(?:Authors?|By)\s*:?\s*(.{20,300}?)(?:\n\s*\n|Abstract|Keywords)", text[:6000], re.S | re.I)
    return author_block


def infer_abstract(text):
    abstract = first_match(r"\bAbstract\b\s*[-:—]?\s*(.{150,2200}?)(?:\n\s*(?:Keywords|Index Terms|I\.?\s+Introduction|1\.?\s+Introduction)\b)", text, re.S | re.I)
    if abstract:
        return abstract
    return clean_text(text[:1200])


def infer_doi(text):
    return first_match(r"\b(10\.\d{4,9}/[-._;()/:A-Z0-9]+)", text[:20000], re.I)


def main():
    OUT_DIR.mkdir(exist_ok=True)
    rows = []
    for pdf_path in sorted(PAPERS_DIR.glob("*.pdf")):
        reader = PdfReader(str(pdf_path))
        metadata = {str(k): str(v) for k, v in (reader.metadata or {}).items()}
        page_texts = []
        for index, page in enumerate(reader.pages, start=1):
            try:
                page_text = page.extract_text() or ""
            except Exception as exc:
                page_text = f"[TEXT EXTRACTION ERROR ON PAGE {index}: {exc}]"
            page_texts.append(f"\n\n--- Page {index} ---\n\n{page_text}")
        text = clean_text("\n".join(page_texts))
        stem = safe_stem(pdf_path)
        text_path = OUT_DIR / f"{stem}.txt"
        metadata_path = OUT_DIR / f"{stem}.json"
        text_path.write_text(text, encoding="utf-8")
        metadata_path.write_text(
            json.dumps(metadata, indent=2, ensure_ascii=False), encoding="utf-8"
        )
        rows.append(
            {
                "file": str(pdf_path),
                "text_file": str(text_path),
                "metadata_file": str(metadata_path),
                "title": infer_title(pdf_path, text, metadata),
                "authors": infer_authors(text, metadata),
                "year": infer_year(text, metadata),
                "doi": infer_doi(text),
                "pages": len(reader.pages),
                "chars_extracted": len(text),
                "abstract": infer_abstract(text),
            }
        )

    with MANIFEST.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)
    print(f"Extracted {len(rows)} PDFs into {OUT_DIR}")
    print(f"Wrote {MANIFEST}")


if __name__ == "__main__":
    main()
