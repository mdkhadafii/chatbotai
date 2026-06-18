from fastapi import APIRouter

from app.core.config import settings
from app.db.chroma import check_chroma_connection
from app.db.mysql import check_mysql_connection
from app.utils.response import success_response


router = APIRouter()


@router.get("/health")
def health_check():
    mysql_status = "connected" if _is_mysql_connected() else "disconnected"
    chromadb_status = "connected" if _is_chromadb_connected() else "disconnected"
    gemini_status = "available" if settings.GEMINI_API_KEY else "not_configured"

    return success_response(
        message="Backend service is running",
        data={
            "mysql": mysql_status,
            "chromadb": chromadb_status,
            "gemini": gemini_status,
        },
    )


def _is_mysql_connected() -> bool:
    try:
        return check_mysql_connection()
    except Exception:
        return False


def _is_chromadb_connected() -> bool:
    try:
        return check_chroma_connection()
    except Exception:
        return False
