from fastapi import status
import google.generativeai as genai

from app.core.config import settings
from app.core.exceptions import AppException


class GeminiEmbeddingService:
    def __init__(self) -> None:
        if not settings.GEMINI_API_KEY:
            raise AppException(
                "Gemini API key belum dikonfigurasi",
                status_code=status.HTTP_502_BAD_GATEWAY,
            )
        genai.configure(api_key=settings.GEMINI_API_KEY)

    def embed_document(self, text: str) -> list[float]:
        return self._embed(text, task_type="retrieval_document")

    def embed_query(self, text: str) -> list[float]:
        return self._embed(text, task_type="retrieval_query")

    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        return [self.embed_document(text) for text in texts]

    def _embed(self, text: str, task_type: str) -> list[float]:
        try:
            response = genai.embed_content(
                model=settings.GEMINI_EMBEDDING_MODEL,
                content=text,
                task_type=task_type,
            )
        except Exception as exc:
            raise AppException(
                "Gemini embedding API error",
                status_code=status.HTTP_502_BAD_GATEWAY,
                errors={"detail": str(exc)},
            ) from exc

        embedding = response.get("embedding") if isinstance(response, dict) else None
        if not embedding:
            raise AppException(
                "Gemini embedding API error",
                status_code=status.HTTP_502_BAD_GATEWAY,
                errors={"detail": "Embedding kosong"},
            )
        return embedding
