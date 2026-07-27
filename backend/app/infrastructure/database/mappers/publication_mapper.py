"""Map persisted publications to domain entities."""

from app.domain.entities.publication import Publication
from app.infrastructure.database.models.publication import Publication as PublicationModel


class PublicationMapper:
    """Convert a SQLAlchemy publication model."""

    @staticmethod
    def to_domain(model: PublicationModel) -> Publication:
        return Publication(
            id=model.id,
            title=model.title,
            slug=model.slug,
            summary=model.summary,
            content=model.content,
            url=model.url,
            publication_type=model.publication_type,
            published_at=model.published_at,
            sort_order=model.sort_order,
            created_at=model.created_at,
            updated_at=model.updated_at,
        )
