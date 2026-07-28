"""Map persisted documents to domain entities."""

from app.domain.entities.document import Document, DocumentType
from app.infrastructure.database.models.document import Document as DocumentModel


class DocumentMapper:
    """Convert a SQLAlchemy document model."""

    @staticmethod
    def to_domain(model: DocumentModel) -> Document:
        return Document(
            id=model.id,
            profile_id=model.profile_id,
            title=model.title,
            description=model.description,
            document_type=DocumentType(model.document_type),
            file_name=model.file_name,
            file_url=model.file_url,
            mime_type=model.mime_type,
            file_size=model.file_size,
            is_public=model.is_public,
            sort_order=model.sort_order,
            created_at=model.created_at,
            updated_at=model.updated_at,
        )
