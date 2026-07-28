"""HTTP endpoint for public documents."""

from typing import Annotated

from fastapi import APIRouter, Depends

from app.api.dependencies.document import get_document_service
from app.api.schemas.document import DocumentResponse
from app.application.services.document_service import DocumentService

router = APIRouter(prefix="/documents", tags=["documents"])


@router.get("", response_model=list[DocumentResponse])
async def get_documents(
    service: Annotated[DocumentService, Depends(get_document_service)],
) -> list[DocumentResponse]:
    documents = await service.get_public_documents()
    return [DocumentResponse.model_validate(item) for item in documents]
