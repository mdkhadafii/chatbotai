from pydantic import BaseModel


class IngestResponseData(BaseModel):
    document_id: int
    total_chunks: int
    status: str
