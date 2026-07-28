"""SQLAlchemy portfolio models registered with the declarative metadata."""

from app.infrastructure.database.models.certification import Certification
from app.infrastructure.database.models.conversation import Conversation
from app.infrastructure.database.models.document import Document
from app.infrastructure.database.models.experience import Experience
from app.infrastructure.database.models.formation import Formation
from app.infrastructure.database.models.message import Message
from app.infrastructure.database.models.profile import Profile
from app.infrastructure.database.models.project import Project
from app.infrastructure.database.models.project_skill import ProjectSkill
from app.infrastructure.database.models.publication import Publication
from app.infrastructure.database.models.skill import Skill

__all__ = [
    "Certification",
    "Conversation",
    "Document",
    "Experience",
    "Formation",
    "Message",
    "Profile",
    "Project",
    "ProjectSkill",
    "Publication",
    "Skill",
]
