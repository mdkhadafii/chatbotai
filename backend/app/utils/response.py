from typing import Any, Dict, Optional


def success_response(message: str = "Operasi berhasil", data: Any = None) -> Dict[str, Any]:
    return {
        "success": True,
        "message": message,
        "data": data if data is not None else {},
    }


def error_response(message: str = "Operasi gagal", errors: Any = None) -> Dict[str, Any]:
    return {
        "success": False,
        "message": message,
        "errors": errors if errors is not None else {},
    }


def paginated_response(
    message: str,
    data: list[Any],
    page: int,
    limit: int,
    total: int,
) -> Dict[str, Any]:
    total_pages = (total + limit - 1) // limit if limit else 0
    return {
        "success": True,
        "message": message,
        "data": data,
        "pagination": {
            "page": page,
            "limit": limit,
            "total": total,
            "total_pages": total_pages,
        },
    }
