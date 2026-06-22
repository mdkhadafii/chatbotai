from app.core.config import settings
from app.db.chroma import get_chroma_collection


class RetrievalService:
    def __init__(self) -> None:
        self.collection = get_chroma_collection()

    def search(
        self,
        query_embedding: list[float],
        top_k: int | None = None,
        source_type: str | None = None,
    ) -> list[dict]:
        where = {"source_type": source_type} if source_type else None
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k or settings.TOP_K_RETRIEVAL,
            where=where,
            include=["documents", "metadatas", "distances"],
        )

        ids = self._first(results.get("ids"))
        documents = self._first(results.get("documents"))
        metadatas = self._first(results.get("metadatas"))
        distances = self._first(results.get("distances"))

        normalized_results = []
        for index, chunk_id in enumerate(ids):
            distance = float(distances[index]) if index < len(distances) else 1.0
            score = self._distance_to_score(distance)
            metadata = metadatas[index] if index < len(metadatas) and metadatas[index] else {}
            content = documents[index] if index < len(documents) else ""

            normalized_results.append(
                {
                    "chunk_id": chunk_id,
                    "document_id": int(metadata.get("document_id", 0) or 0),
                    "content": content,
                    "score": score,
                    "metadata": metadata,
                }
            )
        return normalized_results

    @staticmethod
    def filter_relevant(results: list[dict]) -> list[dict]:
        return [
            result
            for result in results
            if result["score"] >= settings.SIMILARITY_THRESHOLD
        ]

    @staticmethod
    def _distance_to_score(distance: float) -> float:
        return max(0.0, min(1.0, 1.0 - distance))

    @staticmethod
    def _first(value):
        if not value:
            return []
        return value[0] or []
