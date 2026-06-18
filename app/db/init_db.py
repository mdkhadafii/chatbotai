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
    _seed_default_admin()


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
