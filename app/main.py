from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.admin_api import router as admin_router
from app.api.auth_api import router as auth_router
from app.api.document_api import router as document_router
from app.api.health_api import router as health_router
from app.core.config import settings
from app.core.exceptions import register_exception_handlers
from app.db.init_db import init_db
from app.utils.logger import get_logger


logger = get_logger(__name__)


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.APP_NAME,
        debug=settings.APP_DEBUG,
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.on_event("startup")
    def startup() -> None:
        try:
            init_db()
        except Exception as exc:
            logger.exception("Database initialization failed", exc_info=exc)

    register_exception_handlers(app)
    app.include_router(health_router, prefix="/api", tags=["Health"])
    app.include_router(auth_router, prefix="/api")
    app.include_router(admin_router, prefix="/api")
    app.include_router(document_router, prefix="/api")

    return app


app = create_app()
