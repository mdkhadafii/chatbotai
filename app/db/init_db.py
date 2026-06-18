from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import hash_password
from app.db.mysql import Base, engine
from app.models.audit_log_model import AuditLog
from app.models.chat_history_model import ChatHistory
from app.models.chat_source_model import ChatSource
from app.models.document_chunk_model import DocumentChunk
from app.models.document_model import Document
from app.models.user_model import User
from app.utils.logger import get_logger


logger = get_logger(__name__)


def init_db() -> None:
    Base.metadata.create_all(bind=engine)
    _ensure_phase4_schema()
    _seed_default_admin()


def _ensure_phase4_schema() -> None:
    with engine.begin() as connection:
        if _table_exists(connection, "chat_histories"):
            columns = _column_names(connection, "chat_histories")
            if "question" not in columns:
                connection.execute(text("ALTER TABLE chat_histories ADD COLUMN question TEXT NULL"))
            if "answer" not in columns:
                connection.execute(text("ALTER TABLE chat_histories ADD COLUMN answer TEXT NULL"))
            if "user_message" in columns:
                connection.execute(text("ALTER TABLE chat_histories MODIFY COLUMN user_message TEXT NULL"))
            if "bot_answer" in columns:
                connection.execute(text("ALTER TABLE chat_histories MODIFY COLUMN bot_answer LONGTEXT NULL"))

        if _table_exists(connection, "chat_sources"):
            columns = _column_names(connection, "chat_sources")
            if "score" not in columns:
                connection.execute(text("ALTER TABLE chat_sources ADD COLUMN score DECIMAL(5,2) NULL"))
            if "page" not in columns:
                connection.execute(text("ALTER TABLE chat_sources ADD COLUMN page INT NULL"))


def _table_exists(connection, table_name: str) -> bool:
    result = connection.execute(text("SHOW TABLES LIKE :table_name"), {"table_name": table_name})
    return result.first() is not None


def _column_names(connection, table_name: str) -> set[str]:
    result = connection.execute(text(f"SHOW COLUMNS FROM {table_name}"))
    return {row[0] for row in result.fetchall()}


def _seed_default_admin() -> None:
    with Session(engine) as db:
        existing_user = (
            db.query(User)
            .filter(User.email == settings.ADMIN_DEFAULT_EMAIL)
            .first()
        )
        if existing_user:
            return

        admin = User(
            name=settings.ADMIN_DEFAULT_NAME,
            email=settings.ADMIN_DEFAULT_EMAIL,
            password_hash=hash_password(settings.ADMIN_DEFAULT_PASSWORD),
            role="admin",
            is_active=True,
        )
        db.add(admin)
        db.commit()
        logger.info("Default admin user created: %s", settings.ADMIN_DEFAULT_EMAIL)
