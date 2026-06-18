from pathlib import Path

from fastapi import status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.exceptions import AppException
from app.db.chroma import delete_document_vectors, get_chroma_collection
from app.models.document_chunk_model import DocumentChunk
from app.models.document_model import Document
from app.services.gemini_embedding_service import GeminiEmbeddingService
from app.utils.file_reader import FileReader
from app.utils.text_cleaner import clean_text
from app.utils.text_splitter import TextSplitter


class IngestService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.file_reader = FileReader()
        self.text_splitter = TextSplitter()

    def ingest_document(self, document_id: int, reindex: bool = False) -> dict:
        document = self._get_ingestable_document(document_id)
        if document.status == "indexed" and not reindex:
            return self._result(document, self._count_chunks(document.id))

        document.status = "processing"
        self.db.commit()

        try:
            self._delete_existing_chunks(document.id)

            raw_text = self.file_reader.read(document.file_path or "")
            cleaned_text = clean_text(raw_text)
            if not cleaned_text:
                raise AppException(
                    "Isi dokumen kosong atau tidak dapat dibaca",
                    status_code=status.HTTP_400_BAD_REQUEST,
                )

            chunks = self.text_splitter.split(cleaned_text)
            if not chunks:
                raise AppException(
                    "Dokumen tidak menghasilkan chunk",
                    status_code=status.HTTP_400_BAD_REQUEST,
                )

            self._save_processed_text(document.id, cleaned_text)
            embeddings = GeminiEmbeddingService().embed_documents(chunks)
            self._store_vectors(document, chunks, embeddings)
            self._store_chunk_metadata(document, chunks)

            document.status = "indexed"
            self.db.commit()
            self.db.refresh(document)
            return self._result(document, len(chunks))
        except Exception:
            self.db.rollback()
            failed_document = self.db.get(Document, document.id)
            if failed_document:
                failed_document.status = "failed"
                self.db.commit()
            raise

    def ingest_bulk(self) -> dict:
        documents = (
            self.db.query(Document)
            .filter(Document.status == "uploaded")
            .order_by(Document.created_at.asc())
            .all()
        )

        results = []
        failed = []
        for document in documents:
            try:
                results.append(self.ingest_document(document.id))
            except Exception as exc:
                failed.append({"document_id": document.id, "error": str(exc)})

        return {
            "total_documents": len(documents),
            "total_indexed": len(results),
            "total_failed": len(failed),
            "results": results,
            "failed": failed,
        }

    def reindex_document(self, document_id: int) -> dict:
        return self.ingest_document(document_id, reindex=True)

    def _get_ingestable_document(self, document_id: int) -> Document:
        document = self.db.get(Document, document_id)
        if not document or document.status == "deleted":
            raise AppException(
                "Dokumen tidak ditemukan",
                status_code=status.HTTP_404_NOT_FOUND,
            )
        if not document.file_path:
            raise AppException(
                "Dokumen tidak memiliki file",
                status_code=status.HTTP_400_BAD_REQUEST,
            )
        return document

    def _delete_existing_chunks(self, document_id: int) -> None:
        delete_document_vectors(document_id)
        self.db.query(DocumentChunk).filter(DocumentChunk.document_id == document_id).delete(
            synchronize_session=False
        )
        self.db.commit()

    def _store_vectors(
        self,
        document: Document,
        chunks: list[str],
        embeddings: list[list[float]],
    ) -> None:
        collection = get_chroma_collection()
        ids = [self._chunk_id(document.id, index) for index, _ in enumerate(chunks)]
        metadatas = [
            {
                "document_id": document.id,
                "title": document.title,
                "source_type": document.source_type,
                "page": 0,
                "chunk_index": index,
                "uploaded_at": document.created_at.isoformat() if document.created_at else "",
                "file_name": document.file_name or "",
            }
            for index, _ in enumerate(chunks)
        ]

        collection.add(
            ids=ids,
            embeddings=embeddings,
            documents=chunks,
            metadatas=metadatas,
        )

    def _store_chunk_metadata(self, document: Document, chunks: list[str]) -> None:
        chunk_rows = [
            DocumentChunk(
                document_id=document.id,
                chunk_id=self._chunk_id(document.id, index),
                chunk_index=index,
                content_preview=chunk[:500],
                token_count=self.text_splitter.estimate_token_count(chunk),
            )
            for index, chunk in enumerate(chunks)
        ]
        self.db.add_all(chunk_rows)

    @staticmethod
    def _chunk_id(document_id: int, chunk_index: int) -> str:
        return f"doc-{document_id}-chunk-{chunk_index}"

    @staticmethod
    def _result(document: Document, total_chunks: int) -> dict:
        return {
            "document_id": document.id,
            "total_chunks": total_chunks,
            "status": document.status,
        }

    def _count_chunks(self, document_id: int) -> int:
        return self.db.query(DocumentChunk).filter(DocumentChunk.document_id == document_id).count()

    @staticmethod
    def _save_processed_text(document_id: int, text: str) -> None:
        processed_dir = Path(settings.PROCESSED_DIR)
        processed_dir.mkdir(parents=True, exist_ok=True)
        (processed_dir / f"document_{document_id}.txt").write_text(
            text,
            encoding="utf-8",
        )
