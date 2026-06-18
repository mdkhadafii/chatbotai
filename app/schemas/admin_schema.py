from pydantic import BaseModel


class AdminSummary(BaseModel):
    total_documents: int = 0
    total_indexed_documents: int = 0
    total_failed_documents: int = 0
    total_chat: int = 0
    total_chunks: int = 0
