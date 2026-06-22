ALLOWED_SOURCE_TYPES = {
    "faq",
    "sop",
    "layanan_instansi",
    "pdf_resmi",
    "website_resmi",
    "dokumen_peraturan",
    "panduan_pelayanan",
}

ALLOWED_DOCUMENT_EXTENSIONS = {".pdf", ".txt", ".docx", ".csv", ".json", ".html"}
ALLOWED_DOCUMENT_MIME_TYPES = {
    "application/pdf",
    "text/plain",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/csv",
    "application/csv",
    "application/json",
    "text/html",
}


def is_valid_source_type(source_type: str) -> bool:
    return source_type in ALLOWED_SOURCE_TYPES


def is_valid_document_extension(extension: str) -> bool:
    return extension.lower() in ALLOWED_DOCUMENT_EXTENSIONS


def is_valid_document_mime_type(mime_type: str | None) -> bool:
    if not mime_type:
        return False
    return mime_type.lower() in ALLOWED_DOCUMENT_MIME_TYPES
