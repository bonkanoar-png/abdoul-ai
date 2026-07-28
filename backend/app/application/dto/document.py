"""Application DTO for public documents."""

from dataclasses import dataclass
from datetime import datetime
from uuid import UUID

from app.domain.entities.document import Document, DocumentType


@dataclass(frozen=True, slots=True)
class DocumentDTO:
    """Framework-independent document representation."""

    id: UUID
    profile_id: UUID
    title: str
    description: str
    document_type: DocumentType
    file_name: str
    file_url: str
    mime_type: str
    file_size: int
    is_public: bool
    sort_order: int
    created_at: datetime
    updated_at: datetime

    @classmethod
    def from_entity(cls, document: Document) -> "DocumentDTO":
        return cls(
            id=document.id,
            profile_id=document.profile_id,
            title=document.title,
            description=document.description,
            document_type=document.document_type,
            file_name=document.file_name,
            file_url=document.file_url,
            mime_type=document.mime_type,
            file_size=document.file_size,
            is_public=document.is_public,
            sort_order=document.sort_order,
            created_at=document.created_at,
            updated_at=document.updated_at,
        )
