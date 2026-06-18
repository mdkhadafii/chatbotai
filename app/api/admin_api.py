from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_admin
from app.db.mysql import get_db
from app.models.user_model import User
from app.schemas.admin_schema import RetrievalTestRequest
from app.services.audit_log_service import AuditLogService
from app.services.dashboard_service import DashboardService
from app.services.gemini_embedding_service import GeminiEmbeddingService
from app.services.retrieval_service import RetrievalService
from app.utils.response import paginated_response, success_response

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/dashboard/summary")
def dashboard_summary(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    data = DashboardService(db).summary()
    return success_response("Data dashboard berhasil diambil", data)


@router.post("/retrieval/test")
def test_retrieval(
    payload: RetrievalTestRequest,
    _: User = Depends(get_current_admin),
):
    query_embedding = GeminiEmbeddingService().embed_query(payload.query)
    results = RetrievalService().search(
        query_embedding=query_embedding,
        top_k=payload.top_k,
        source_type=payload.source_type,
    )
    data = {
        "query": payload.query,
        "top_k": payload.top_k,
        "results": [
            {
                "chunk_id": result["chunk_id"],
                "document_id": result["document_id"],
                "content": result["content"],
                "score": round(result["score"], 4),
                "metadata": result["metadata"],
            }
            for result in results
        ],
    }
    return success_response("Hasil retrieval berhasil diambil", data)


@router.get("/audit-logs")
def list_audit_logs(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    user_id: int | None = None,
    action: str | None = None,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    logs, total = AuditLogService(db).list_logs(
        page=page,
        limit=limit,
        user_id=user_id,
        action=action,
    )
    data = [
        {
            "id": log.id,
            "user_id": log.user_id,
            "action": log.action,
            "description": log.description,
            "ip_address": log.ip_address,
            "user_agent": log.user_agent,
            "created_at": log.created_at.isoformat() if log.created_at else None,
        }
        for log in logs
    ]
    return paginated_response("Audit log berhasil diambil", data, page, limit, total)
