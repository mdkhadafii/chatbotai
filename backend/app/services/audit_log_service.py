from fastapi import Request
from sqlalchemy.orm import Session

from app.models.audit_log_model import AuditLog


class AuditLogService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create_log(
        self,
        action: str,
        description: str,
        user_id: int | None = None,
        request: Request | None = None,
    ) -> AuditLog:
        audit_log = AuditLog(
            user_id=user_id,
            action=action,
            description=description,
            ip_address=self._get_client_ip(request),
            user_agent=request.headers.get("user-agent") if request else None,
        )
        self.db.add(audit_log)
        self.db.commit()
        self.db.refresh(audit_log)
        return audit_log

    def list_logs(
        self,
        page: int = 1,
        limit: int = 10,
        user_id: int | None = None,
        action: str | None = None,
    ) -> tuple[list[AuditLog], int]:
        query = self.db.query(AuditLog)
        if user_id:
            query = query.filter(AuditLog.user_id == user_id)
        if action:
            query = query.filter(AuditLog.action == action)

        total = query.count()
        logs = (
            query.order_by(AuditLog.created_at.desc())
            .offset((page - 1) * limit)
            .limit(limit)
            .all()
        )
        return logs, total

    @staticmethod
    def _get_client_ip(request: Request | None) -> str | None:
        if not request or not request.client:
            return None
        forwarded_for = request.headers.get("x-forwarded-for")
        if forwarded_for:
            return forwarded_for.split(",")[0].strip()
        return request.client.host
