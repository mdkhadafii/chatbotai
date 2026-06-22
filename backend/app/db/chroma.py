from chromadb import HttpClient

from app.core.config import settings


def get_chroma_client():
    return HttpClient(host=settings.CHROMA_HOST, port=settings.CHROMA_PORT)


def get_chroma_collection():
    client = get_chroma_client()
    return client.get_or_create_collection(
        name=settings.CHROMA_COLLECTION_NAME,
        metadata={"hnsw:space": "cosine"},
    )


def delete_document_vectors(document_id: int) -> None:
    collection = get_chroma_collection()
    collection.delete(where={"document_id": document_id})


def check_chroma_connection() -> bool:
    client = get_chroma_client()
    client.heartbeat()
    return True
