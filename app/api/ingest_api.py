from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_admin
from app.db.mysql import get_db
from app.models.user_model import User
from app.services.audit_log_service import AuditLogService
from app.services.ingest_service import IngestService
from app.utils.response import success_response

router = APIRouter(prefix="/admin/ingest", tags=["Ingestion"])


@router.post("/bulk")
def ingest_bulk(
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    result = IngestService(db).ingest_bulk()
    AuditLogService(db).create_log(
        action="bulk_ingest_document",
        description="Bulk ingest dokumen uploaded",
        user_id=current_user.id,
        request=request,
    )
    return success_response("Bulk ingest selesai", result)


@router.post("/reindex/{document_id}")
def reindex_document(
    document_id: int,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    result = IngestService(db).reindex_document(document_id)
    AuditLogService(db).create_log(
        action="reindex_document",
        description=f"Re-index dokumen ID {document_id}",
        user_id=current_user.id,
        request=request,
    )
    return success_response("Dokumen berhasil di-index ulang", result)


@router.post("/{document_id}")
def ingest_document(
    document_id: int,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    result = IngestService(db).ingest_document(document_id)
    AuditLogService(db).create_log(
        action="ingest_document",
        description=f"Ingest dokumen ID {document_id}",
        user_id=current_user.id,
        request=request,
    )
    return success_response("Dokumen berhasil di-index", result)
