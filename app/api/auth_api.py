from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_admin
from app.db.mysql import get_db
from app.models.user_model import User
from app.schemas.auth_schema import LoginRequest, RefreshTokenRequest
from app.services.audit_log_service import AuditLogService
from app.services.auth_service import AuthService
from app.utils.response import success_response

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login")
def login(payload: LoginRequest, request: Request, db: Session = Depends(get_db)):
    auth_service = AuthService(db)
    user = auth_service.authenticate(payload)
    token_data = auth_service.build_token_response(user)
    AuditLogService(db).create_log(
        action="login",
        description=f"Admin {user.email} login",
        user_id=user.id,
        request=request,
    )
    return success_response("Login berhasil", token_data)


@router.post("/refresh")
def refresh_token(payload: RefreshTokenRequest, db: Session = Depends(get_db)):
    token_data = AuthService(db).refresh(payload.refresh_token)
    return success_response("Token berhasil diperbarui", token_data)


@router.post("/logout")
def logout(current_user: User = Depends(get_current_admin)):
    return success_response(
        "Logout berhasil",
        {"user_id": current_user.id},
    )


@router.get("/me")
def me(current_user: User = Depends(get_current_admin)):
    return success_response(
        "Data user berhasil diambil",
        {
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email,
            "role": current_user.role,
        },
    )
