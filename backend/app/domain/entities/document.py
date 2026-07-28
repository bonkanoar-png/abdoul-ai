"""Framework-independent public document entity."""

from dataclasses import dataclass
from datetime import datetime
from enum import StrEnum
from uuid import UUID

from app.domain.exceptions.portfolio import InvalidDocument


class DocumentType(StrEnum):
    """Supported public document categories."""

    CV = "CV"
    PORTFOLIO = "PORTFOLIO"
    REPORT = "REPORT"
    CERTIFICATE = "CERTIFICATE"
    OTHER = "OTHER"


@dataclass(frozen=True, slots=True)
class Document:
    """Metadata for a public document associated with a profile."""

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

    def __post_init__(self) -> None:
        if not self.title.strip():
            raise InvalidDocument("A document title is required.")
        if not self.file_name.strip():
            raise InvalidDocument("A document file name is required.")
        if not self.mime_type.strip():
            raise InvalidDocument("A document MIME type is required.")
        if self.file_size <= 0:
            raise InvalidDocument("Document file size must be greater than zero.")
        if self.sort_order < 0:
            raise InvalidDocument("Document sort order cannot be negative.")
