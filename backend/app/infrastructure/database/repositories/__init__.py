"""SQLAlchemy implementations of domain repository contracts."""

from app.infrastructure.database.repositories.certification_repository import (
    SQLAlchemyCertificationRepository,
)
from app.infrastructure.database.repositories.conversation_repository import (
    SQLAlchemyConversationRepository,
)
from app.infrastructure.database.repositories.document_repository import (
    SQLAlchemyDocumentRepository,
)
from app.infrastructure.database.repositories.experience_repository import (
    SQLAlchemyExperienceRepository,
)
from app.infrastructure.database.repositories.formation_repository import (
    SQLAlchemyFormationRepository,
)
from app.infrastructure.database.repositories.message_repository import (
    SQLAlchemyMessageRepository,
)
from app.infrastructure.database.repositories.portfolio_repository import (
    SQLAlchemyPortfolioRepository,
)
from app.infrastructure.database.repositories.profile_repository import (
    SQLAlchemyProfileRepository,
)
from app.infrastructure.database.repositories.project_repository import SQLAlchemyProjectRepository
from app.infrastructure.database.repositories.publication_repository import (
    SQLAlchemyPublicationRepository,
)
from app.infrastructure.database.repositories.skill_repository import SQLAlchemySkillRepository
from app.infrastructure.database.repositories.technology_repository import (
    SQLAlchemyTechnologyRepository,
)

__all__ = [
    "SQLAlchemyCertificationRepository",
    "SQLAlchemyConversationRepository",
    "SQLAlchemyDocumentRepository",
    "SQLAlchemyExperienceRepository",
    "SQLAlchemyFormationRepository",
    "SQLAlchemyMessageRepository",
    "SQLAlchemyPortfolioRepository",
    "SQLAlchemyProfileRepository",
    "SQLAlchemyProjectRepository",
    "SQLAlchemyPublicationRepository",
    "SQLAlchemySkillRepository",
    "SQLAlchemyTechnologyRepository",
]
