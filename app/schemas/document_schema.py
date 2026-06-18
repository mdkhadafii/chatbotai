from datetime import datetime

from pydantic import BaseModel, Field


class DocumentBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    source_type: str = Field(..., min_length=1, max_length=50)
    description: str | None = None


class DocumentUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=255)
    source_type: str | None = Field(default=None, min_length=1, max_length=50)
    description: str | None = None
    status: str | None = Field(default=None, max_length=50)


class DocumentResponse(BaseModel):
    id: int
    title: str
    description: str | None
    file_name: str | None
    file_path: str | None
    file_type: str | None
    source_type: str
    source_url: str | None
    status: str
    uploaded_by: int | None
    created_at: datetime | None
    updated_at: datetime | None

    model_config = {"from_attributes": True}
