from pathlib import Path
from uuid import uuid4

from sqlalchemy.orm import Session

from app.models.chat_history_model import ChatHistory
from app.models.chat_source_model import ChatSource
from app.services.gemini_embedding_service import GeminiEmbeddingService
from app.services.gemini_llm_service import GeminiLLMService
from app.services.retrieval_service import RetrievalService
from app.utils.text_cleaner import clean_text


class RAGService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.embedding_service = GeminiEmbeddingService()
        self.retrieval_service = RetrievalService()

    def answer_question(self, question: str, session_id: str | None = None) -> dict:
        session_id = session_id or f"session-{uuid4().hex}"
        cleaned_question = clean_text(question)

        query_embedding = self.embedding_service.embed_query(cleaned_question)
        retrieved_results = self.retrieval_service.search(query_embedding)
        relevant_results = self.retrieval_service.filter_relevant(retrieved_results)

        if not relevant_results:
            answer = "Maaf, informasi tersebut belum tersedia di dokumen resmi yang ada saat ini."
            confidence_score = 0.0
            chat_history = self._save_chat_history(
                session_id=session_id,
                question=cleaned_question,
                answer=answer,
                confidence_score=confidence_score,
            )
            return self._response(chat_history, cleaned_question, answer, [], confidence_score)

        prompt = self._build_prompt(cleaned_question, relevant_results)
        answer = GeminiLLMService().generate_answer(prompt)
        confidence_score = max(result["score"] for result in relevant_results)

        chat_history = self._save_chat_history(
            session_id=session_id,
            question=cleaned_question,
            answer=answer,
            confidence_score=confidence_score,
        )
        sources = self._save_sources(chat_history.id, relevant_results)
        return self._response(chat_history, cleaned_question, answer, sources, confidence_score)

    def _build_prompt(self, question: str, results: list[dict]) -> str:
        system_instruction = Path("app/prompts/system_prompt.txt").read_text(encoding="utf-8")
        rag_template = Path("app/prompts/rag_prompt.txt").read_text(encoding="utf-8")
        context = "\n\n".join(
            (
                f"Sumber {index + 1}: {result['metadata'].get('title', 'Dokumen')}\n"
                f"Tipe: {result['metadata'].get('source_type', '-')}\n"
                f"Skor: {result['score']:.2f}\n"
                f"Isi:\n{result['content']}"
            )
            for index, result in enumerate(results)
        )
        return rag_template.format(
            system_instruction=system_instruction,
            question=question,
            context=context,
        )

    def _save_chat_history(
        self,
        session_id: str,
        question: str,
        answer: str,
        confidence_score: float,
    ) -> ChatHistory:
        chat_history = ChatHistory(
            session_id=session_id,
            question=question,
            answer=answer,
            confidence_score=round(confidence_score, 2),
        )
        self.db.add(chat_history)
        self.db.commit()
        self.db.refresh(chat_history)
        return chat_history

    def _save_sources(self, chat_history_id: int, results: list[dict]) -> list[dict]:
        sources = []
        for result in results:
            metadata = result["metadata"]
            if result["document_id"] <= 0:
                continue
            source = ChatSource(
                chat_history_id=chat_history_id,
                document_id=result["document_id"],
                chunk_id=result["chunk_id"],
                title=metadata.get("title", "Dokumen"),
                source_type=metadata.get("source_type", "-"),
                score=round(result["score"], 2),
                page=int(metadata.get("page", 0) or 0) or None,
            )
            self.db.add(source)
            sources.append(source)

        self.db.commit()
        return [
            {
                "document_id": source.document_id,
                "title": source.title,
                "source_type": source.source_type,
                "page": source.page,
                "score": float(source.score or 0),
            }
            for source in sources
        ]

    @staticmethod
    def _response(
        chat_history: ChatHistory,
        question: str,
        answer: str,
        sources: list[dict],
        confidence_score: float,
    ) -> dict:
        return {
            "session_id": chat_history.session_id,
            "question": question,
            "answer": answer,
            "sources": sources,
            "confidence_score": round(confidence_score, 2),
        }
