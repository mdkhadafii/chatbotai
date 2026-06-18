from pydantic import BaseModel, Field


class AdminSummary(BaseModel):
    total_documents: int = 0
    total_indexed_documents: int = 0
    total_failed_documents: int = 0
    total_chat: int = 0
    total_chunks: int = 0


class RetrievalTestRequest(BaseModel):
    query: str = Field(..., min_length=1)
    top_k: int = Field(default=5, ge=1, le=20)
    source_type: str | None = None
