import shutil
from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.exceptions import AppException
from app.models.document_model import Document
from app.schemas.document_schema import DocumentUpdate
from app.utils.validator import (
    is_valid_document_extension,
    is_valid_document_mime_type,
    is_valid_source_type,
)


class DocumentService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def upload_document(
        self,
        file: UploadFile,
        title: str,
        source_type: str,
        description: str | None,
        uploaded_by: int,
    ) -> Document:
        self._validate_source_type(source_type)
        file_path = self._save_upload(file)

        document = Document(
            title=title,
            description=description,
            file_name=file.filename,
            file_path=str(file_path).replace("\\", "/"),
            file_type=file_path.suffix.lower().lstrip("."),
            source_type=source_type,
            status="uploaded",
            uploaded_by=uploaded_by,
        )
        self.db.add(document)
        self.db.commit()
        self.db.refresh(document)
        return document

    def list_documents(
        self,
        page: int = 1,
        limit: int = 10,
        search: str | None = None,
        source_type: str | None = None,
        status_filter: str | None = None,
    ) -> tuple[list[Document], int]:
        query = self.db.query(Document)
        if search:
            query = query.filter(Document.title.like(f"%{search}%"))
        if source_type:
            self._validate_source_type(source_type)
            query = query.filter(Document.source_type == source_type)
        if status_filter:
            query = query.filter(Document.status == status_filter)
        else:
            query = query.filter(Document.status != "deleted")

        total = query.count()
        documents = (
            query.order_by(Document.created_at.desc())
            .offset((page - 1) * limit)
            .limit(limit)
            .all()
        )
        return documents, total

    def get_document(self, document_id: int) -> Document:
        document = self.db.get(Document, document_id)
        if not document or document.status == "deleted":
            raise AppException(
                "Dokumen tidak ditemukan",
                status_code=status.HTTP_404_NOT_FOUND,
            )
        return document

    def update_document(self, document_id: int, payload: DocumentUpdate) -> Document:
        document = self.get_document(document_id)
        update_data = payload.model_dump(exclude_unset=True)

        if "source_type" in update_data and update_data["source_type"]:
            self._validate_source_type(update_data["source_type"])

        for field, value in update_data.items():
            setattr(document, field, value)

        self.db.commit()
        self.db.refresh(document)
        return document

    def delete_document(self, document_id: int) -> Document:
        document = self.get_document(document_id)
        self._delete_file(document.file_path)
        document.status = "deleted"
        self.db.commit()
        self.db.refresh(document)
        return document

    def _save_upload(self, file: UploadFile) -> Path:
        original_name = Path(file.filename or "").name
        extension = Path(original_name).suffix.lower()

        if not original_name or not extension:
            raise AppException("File tidak valid", status_code=status.HTTP_400_BAD_REQUEST)
        if not is_valid_document_extension(extension):
            raise AppException("Ekstensi file tidak valid", status_code=status.HTTP_400_BAD_REQUEST)
        if not is_valid_document_mime_type(file.content_type):
            raise AppException("MIME type file tidak valid", status_code=status.HTTP_400_BAD_REQUEST)

        upload_dir = Path(settings.UPLOAD_DIR)
        upload_dir.mkdir(parents=True, exist_ok=True)

        safe_name = f"{uuid4().hex}{extension}"
        destination = upload_dir / safe_name
        max_size = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
        size = 0

        with destination.open("wb") as buffer:
            while chunk := file.file.read(1024 * 1024):
                size += len(chunk)
                if size > max_size:
                    buffer.close()
                    destination.unlink(missing_ok=True)
                    raise AppException(
                        "Ukuran file melebihi batas",
                        status_code=status.HTTP_400_BAD_REQUEST,
                    )
                buffer.write(chunk)

        file.file.seek(0)
        return destination

    @staticmethod
    def _delete_file(file_path: str | None) -> None:
        if not file_path:
            return
        path = Path(file_path)
        if path.exists() and path.is_file():
            path.unlink()

    @staticmethod
    def _validate_source_type(source_type: str) -> None:
        if not is_valid_source_type(source_type):
            raise AppException(
                "Source type dokumen tidak valid",
                status_code=status.HTTP_400_BAD_REQUEST,
            )
