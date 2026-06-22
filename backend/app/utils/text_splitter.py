from app.core.config import settings


class TextSplitter:
    def __init__(
        self,
        chunk_size: int | None = None,
        chunk_overlap: int | None = None,
    ) -> None:
        self.chunk_size = chunk_size or settings.CHUNK_SIZE
        self.chunk_overlap = chunk_overlap or settings.CHUNK_OVERLAP
        if self.chunk_overlap >= self.chunk_size:
            raise ValueError("chunk_overlap harus lebih kecil dari chunk_size")

    def split(self, text: str) -> list[str]:
        text = text.strip()
        if not text:
            return []

        chunks: list[str] = []
        start = 0
        text_length = len(text)

        while start < text_length:
            end = min(start + self.chunk_size, text_length)
            chunk = self._trim_to_boundary(text[start:end])
            if chunk:
                chunks.append(chunk)

            if end >= text_length:
                break
            start = max(end - self.chunk_overlap, start + 1)

        return chunks

    @staticmethod
    def estimate_token_count(text: str) -> int:
        return max(1, len(text.split()))

    @staticmethod
    def _trim_to_boundary(text: str) -> str:
        if len(text) < 100:
            return text.strip()

        boundary = max(text.rfind("\n"), text.rfind(". "), text.rfind(" "))
        if boundary > len(text) * 0.6:
            return text[: boundary + 1].strip()
        return text.strip()
