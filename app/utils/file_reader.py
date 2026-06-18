import csv
import json
from pathlib import Path

from bs4 import BeautifulSoup
from docx import Document as DocxDocument
from fastapi import status
from pypdf import PdfReader

from app.core.exceptions import AppException


class FileReader:
    def read(self, file_path: str) -> str:
        path = Path(file_path)
        if not path.exists() or not path.is_file():
            raise AppException(
                "File dokumen tidak ditemukan",
                status_code=status.HTTP_404_NOT_FOUND,
            )

        extension = path.suffix.lower()
        if extension == ".txt":
            return self._read_text(path)
        if extension == ".pdf":
            return self._read_pdf(path)
        if extension == ".docx":
            return self._read_docx(path)
        if extension == ".csv":
            return self._read_csv(path)
        if extension == ".json":
            return self._read_json(path)
        if extension == ".html":
            return self._read_html(path)

        raise AppException(
            "Format file belum didukung",
            status_code=status.HTTP_400_BAD_REQUEST,
        )

    @staticmethod
    def _read_text(path: Path) -> str:
        return path.read_text(encoding="utf-8", errors="ignore")

    @staticmethod
    def _read_pdf(path: Path) -> str:
        reader = PdfReader(str(path))
        pages = []
        for page_number, page in enumerate(reader.pages, start=1):
            text = page.extract_text() or ""
            if text.strip():
                pages.append(f"[Halaman {page_number}]\n{text}")
        return "\n\n".join(pages)

    @staticmethod
    def _read_docx(path: Path) -> str:
        document = DocxDocument(str(path))
        paragraphs = [paragraph.text for paragraph in document.paragraphs]
        return "\n".join(paragraph for paragraph in paragraphs if paragraph.strip())

    @staticmethod
    def _read_csv(path: Path) -> str:
        rows = []
        with path.open("r", encoding="utf-8", errors="ignore", newline="") as csv_file:
            reader = csv.DictReader(csv_file)
            if reader.fieldnames:
                for row in reader:
                    rows.append("; ".join(f"{key}: {value}" for key, value in row.items()))
            else:
                csv_file.seek(0)
                raw_reader = csv.reader(csv_file)
                rows = [", ".join(row) for row in raw_reader]
        return "\n".join(rows)

    @staticmethod
    def _read_json(path: Path) -> str:
        data = json.loads(path.read_text(encoding="utf-8", errors="ignore"))
        return json.dumps(data, ensure_ascii=False, indent=2)

    @staticmethod
    def _read_html(path: Path) -> str:
        soup = BeautifulSoup(path.read_text(encoding="utf-8", errors="ignore"), "html.parser")
        for element in soup(["script", "style", "noscript"]):
            element.decompose()
        return soup.get_text(separator="\n")
