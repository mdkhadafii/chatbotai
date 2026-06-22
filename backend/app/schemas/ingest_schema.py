from pydantic import BaseModel


class IngestResponseData(BaseModel):
    document_id: int
    total_chunks: int
    status: str


class BulkIngestResponseData(BaseModel):
    total_documents: int
    total_indexed: int
    total_failed: int
    results: list[IngestResponseData]
    failed: list[dict]
