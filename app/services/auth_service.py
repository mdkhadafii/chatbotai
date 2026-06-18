from fastapi import status
from sqlalchemy.orm import Session

from app.core.exceptions import AppException
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    verify_password,
)
from app.models.user_model import User
from app.schemas.auth_schema import LoginRequest


class AuthService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def authenticate(self, payload: LoginRequest) -> User:
        user = self.db.query(User).filter(User.email == payload.email).first()
        if not user or not verify_password(payload.password, user.password_hash):
            raise AppException(
                "Email atau password salah",
                status_code=status.HTTP_401_UNAUTHORIZED,
            )

        if not user.is_active:
            raise AppException(
                "User tidak aktif",
                status_code=status.HTTP_403_FORBIDDEN,
            )
        return user

    def build_token_response(self, user: User) -> dict:
        claims = {"role": user.role, "token_type": "access"}
        return {
            "access_token": create_access_token(str(user.id), claims),
            "refresh_token": create_refresh_token(str(user.id), {"role": user.role}),
            "token_type": "Bearer",
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role,
            },
        }

    def refresh(self, refresh_token: str) -> dict:
        try:
            payload = decode_token(refresh_token)
        except ValueError as exc:
            raise AppException(
                "Token tidak valid",
                status_code=status.HTTP_401_UNAUTHORIZED,
            ) from exc

        if payload.get("token_type") != "refresh":
            raise AppException(
                "Token tidak valid",
                status_code=status.HTTP_401_UNAUTHORIZED,
            )

        user_id = payload.get("sub")
        user = self.db.get(User, int(user_id)) if user_id else None
        if not user or not user.is_active:
            raise AppException(
                "Token tidak valid",
                status_code=status.HTTP_401_UNAUTHORIZED,
            )
        return self.build_token_response(user)
