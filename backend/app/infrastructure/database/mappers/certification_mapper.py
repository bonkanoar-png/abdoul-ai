"""Map persisted certifications to domain entities."""

from app.domain.entities.certification import Certification
from app.infrastructure.database.models.certification import Certification as CertificationModel


class CertificationMapper:
    """Convert a SQLAlchemy certification model."""

    @staticmethod
    def to_domain(model: CertificationModel) -> Certification:
        return Certification(
            id=model.id,
            name=model.name,
            issuer=model.issuer,
            credential_url=model.credential_url,
            issued_at=model.issued_at,
            expiration_date=model.expiration_date,
            sort_order=model.sort_order,
            created_at=model.created_at,
            updated_at=model.updated_at,
        )
