from typing import Any, Optional

from pydantic import BaseModel


class ApiResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Any] = None


class ErrorResponse(BaseModel):
    success: bool = False
    message: str
    errors: Any = {}


class Pagination(BaseModel):
    page: int
    limit: int
    total: int
    total_pages: int


class PaginatedResponse(BaseModel):
    success: bool
    message: str
    data: list[Any]
    pagination: Pagination
