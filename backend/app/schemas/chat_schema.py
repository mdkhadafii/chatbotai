from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    session_id: str | None = None
    question: str = Field(..., min_length=1)


class ChatSourceResponse(BaseModel):
    document_id: int
    title: str
    source_type: str
    page: int | None = None
    score: float


class ChatResponse(BaseModel):
    session_id: str
    question: str
    answer: str
    sources: list[ChatSourceResponse]
    confidence_score: float
