from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_admin
from app.core.exceptions import AppException
from app.db.mysql import get_db
from app.models.chat_history_model import ChatHistory
from app.models.chat_source_model import ChatSource
from app.models.user_model import User
from app.schemas.chat_schema import ChatRequest
from app.services.rag_service import RAGService
from app.utils.response import paginated_response, success_response

router = APIRouter(prefix="/chat", tags=["Chatbot"])


@router.post("")
def chat(payload: ChatRequest, db: Session = Depends(get_db)):
    result = RAGService(db).answer_question(
        question=payload.question,
        session_id=payload.session_id,
    )
    return success_response("Jawaban berhasil dibuat", result)


@router.get("/history")
def list_chat_history(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    query = db.query(ChatHistory)
    total = query.count()
    histories = (
        query.order_by(ChatHistory.created_at.desc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )
    data = [_serialize_chat_history(history) for history in histories]
    return paginated_response("Riwayat chat berhasil diambil", data, page, limit, total)


@router.get("/history/{chat_history_id}")
def get_chat_history(
    chat_history_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    history = db.get(ChatHistory, chat_history_id)
    if not history:
        raise AppException("Riwayat chat tidak ditemukan", status_code=404)

    sources = (
        db.query(ChatSource)
        .filter(ChatSource.chat_history_id == history.id)
        .order_by(ChatSource.score.desc())
        .all()
    )
    data = _serialize_chat_history(history)
    data["sources"] = [_serialize_chat_source(source) for source in sources]
    return success_response("Detail riwayat chat berhasil diambil", data)


@router.delete("/history/{chat_history_id}")
def delete_chat_history(
    chat_history_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    history = db.get(ChatHistory, chat_history_id)
    if not history:
        raise AppException("Riwayat chat tidak ditemukan", status_code=404)

    db.query(ChatSource).filter(ChatSource.chat_history_id == history.id).delete(
        synchronize_session=False
    )
    db.delete(history)
    db.commit()
    return success_response(
        "Riwayat chat berhasil dihapus",
        {"id": chat_history_id},
    )


def _serialize_chat_history(history: ChatHistory) -> dict:
    return {
        "id": history.id,
        "session_id": history.session_id,
        "question": history.question,
        "answer": history.answer,
        "confidence_score": float(history.confidence_score or 0),
        "created_at": history.created_at.isoformat() if history.created_at else None,
    }


def _serialize_chat_source(source: ChatSource) -> dict:
    return {
        "id": source.id,
        "document_id": source.document_id,
        "chunk_id": source.chunk_id,
        "title": source.title,
        "source_type": source.source_type,
        "score": float(source.score or 0),
        "page": source.page,
        "created_at": source.created_at.isoformat() if source.created_at else None,
    }
