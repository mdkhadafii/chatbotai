from fastapi import APIRouter, Depends, File, Form, Query, Request, UploadFile
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_admin
from app.db.mysql import get_db
from app.models.user_model import User
from app.schemas.document_schema import DocumentUpdate
from app.services.audit_log_service import AuditLogService
from app.services.document_service import DocumentService
from app.utils.response import paginated_response, success_response

router = APIRouter(prefix="/admin/documents", tags=["Documents"])


@router.post("/upload")
def upload_document(
    request: Request,
    file: UploadFile = File(...),
    title: str = Form(...),
    source_type: str = Form(...),
    description: str | None = Form(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    document = DocumentService(db).upload_document(
        file=file,
        title=title,
        source_type=source_type,
        description=description,
        uploaded_by=current_user.id,
    )
    AuditLogService(db).create_log(
        action="upload_document",
        description=f"Upload dokumen {document.title}",
        user_id=current_user.id,
        request=request,
    )
    return success_response(
        "Dokumen berhasil diupload",
        {
            "id": document.id,
            "title": document.title,
            "file_name": document.file_name,
            "source_type": document.source_type,
            "status": document.status,
        },
    )


@router.get("")
def list_documents(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: str | None = None,
    source_type: str | None = None,
    status: str | None = None,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    documents, total = DocumentService(db).list_documents(
        page=page,
        limit=limit,
        search=search,
        source_type=source_type,
        status_filter=status,
    )
    data = [_serialize_document(document) for document in documents]
    return paginated_response("Data dokumen berhasil diambil", data, page, limit, total)


@router.get("/{document_id}")
def get_document(
    document_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    document = DocumentService(db).get_document(document_id)
    return success_response("Detail dokumen berhasil diambil", _serialize_document(document))


@router.put("/{document_id}")
def update_document(
    document_id: int,
    payload: DocumentUpdate,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    document = DocumentService(db).update_document(document_id, payload)
    AuditLogService(db).create_log(
        action="update_document",
        description=f"Update dokumen {document.title}",
        user_id=current_user.id,
        request=request,
    )
    return success_response("Dokumen berhasil diperbarui", _serialize_document(document))


@router.delete("/{document_id}")
def delete_document(
    document_id: int,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    document = DocumentService(db).delete_document(document_id)
    AuditLogService(db).create_log(
        action="delete_document",
        description=f"Hapus dokumen {document.title}",
        user_id=current_user.id,
        request=request,
    )
    return success_response(
        "Dokumen berhasil dihapus",
        {"id": document.id, "status": document.status},
    )


def _serialize_document(document) -> dict:
    return {
        "id": document.id,
        "title": document.title,
        "description": document.description,
        "file_name": document.file_name,
        "file_path": document.file_path,
        "file_type": document.file_type,
        "source_type": document.source_type,
        "source_url": document.source_url,
        "status": document.status,
        "uploaded_by": document.uploaded_by,
        "created_at": document.created_at.isoformat() if document.created_at else None,
        "updated_at": document.updated_at.isoformat() if document.updated_at else None,
    }
