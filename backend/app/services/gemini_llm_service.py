from fastapi import status
import google.generativeai as genai

from app.core.config import settings
from app.core.exceptions import AppException


class GeminiLLMService:
    def __init__(self) -> None:
        if not settings.GEMINI_API_KEY:
            raise AppException(
                "Gemini API key belum dikonfigurasi",
                status_code=status.HTTP_502_BAD_GATEWAY,
            )
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel(
            model_name=settings.GEMINI_LLM_MODEL,
            generation_config={
                "temperature": settings.GEMINI_TEMPERATURE,
                "max_output_tokens": settings.GEMINI_MAX_OUTPUT_TOKENS,
            },
        )

    def generate_answer(self, prompt: str) -> str:
        try:
            response = self.model.generate_content(prompt)
        except Exception as exc:
            raise AppException(
                "Gemini API error",
                status_code=status.HTTP_502_BAD_GATEWAY,
                errors={"detail": str(exc)},
            ) from exc

        answer = getattr(response, "text", None)
        if not answer:
            raise AppException(
                "Gemini API error",
                status_code=status.HTTP_502_BAD_GATEWAY,
                errors={"detail": "Jawaban Gemini kosong"},
            )
        return answer.strip()
