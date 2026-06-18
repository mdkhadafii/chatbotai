from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_admin
from app.db.mysql import get_db
from app.models.user_model import User
from app.services.audit_log_service import AuditLogService
from app.utils.response import paginated_response

router = APIRouter(prefix="/admin", tags=["Admin"])


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
