from fastapi import Depends, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.exceptions import AppException
from app.core.security import decode_token
from app.db.mysql import get_db
from app.models.user_model import User


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    try:
        payload = decode_token(token)
    except ValueError as exc:
        raise AppException(
            "Token tidak valid",
            status_code=status.HTTP_401_UNAUTHORIZED,
        ) from exc

    if payload.get("token_type", "access") != "access":
        raise AppException(
            "Token tidak valid",
            status_code=status.HTTP_401_UNAUTHORIZED,
        )

    user_id = payload.get("sub")
    if not user_id:
        raise AppException(
            "Token tidak valid",
            status_code=status.HTTP_401_UNAUTHORIZED,
        )

    user = db.get(User, int(user_id))
    if not user or not user.is_active:
        raise AppException(
            "Token tidak valid",
            status_code=status.HTTP_401_UNAUTHORIZED,
        )
    return user


def get_current_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "admin":
        raise AppException(
            "Akses ditolak",
            status_code=status.HTTP_403_FORBIDDEN,
        )
    return current_user
