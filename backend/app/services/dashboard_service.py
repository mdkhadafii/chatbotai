from sqlalchemy import func
from sqlalchemy.orm import Session

from app.api.health_api import _is_chromadb_connected, _is_mysql_connected
from app.core.config import settings
from app.models.chat_history_model import ChatHistory
from app.models.document_chunk_model import DocumentChunk
from app.models.document_model import Document


class DashboardService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def summary(self) -> dict:
        return {
            "total_documents": self._count_documents(),
            "total_indexed_documents": self._count_documents(status="indexed"),
            "total_failed_documents": self._count_documents(status="failed"),
            "total_chat": self.db.query(ChatHistory).count(),
            "total_chunks": self.db.query(DocumentChunk).count(),
            "documents_by_source_type": self._documents_by_source_type(),
            "documents_by_status": self._documents_by_status(),
            "frequent_questions": self._frequent_questions(),
            "system_status": {
                "mysql": "connected" if _is_mysql_connected() else "disconnected",
                "chromadb": "connected" if _is_chromadb_connected() else "disconnected",
                "gemini": "available" if settings.GEMINI_API_KEY else "not_configured",
            },
        }

    def _count_documents(self, status: str | None = None) -> int:
        query = self.db.query(Document).filter(Document.status != "deleted")
        if status:
            query = query.filter(Document.status == status)
        return query.count()

    def _documents_by_source_type(self) -> list[dict]:
        rows = (
            self.db.query(Document.source_type, func.count(Document.id))
            .filter(Document.status != "deleted")
            .group_by(Document.source_type)
            .all()
        )
        return [{"source_type": source_type, "total": total} for source_type, total in rows]

    def _documents_by_status(self) -> list[dict]:
        rows = (
            self.db.query(Document.status, func.count(Document.id))
            .filter(Document.status != "deleted")
            .group_by(Document.status)
            .all()
        )
        return [{"status": status, "total": total} for status, total in rows]

    def _frequent_questions(self) -> list[dict]:
        rows = (
            self.db.query(ChatHistory.question, func.count(ChatHistory.id).label("total"))
            .filter(ChatHistory.question.isnot(None))
            .group_by(ChatHistory.question)
            .order_by(func.count(ChatHistory.id).desc())
            .limit(10)
            .all()
        )
        return [{"question": question, "total": total} for question, total in rows]
