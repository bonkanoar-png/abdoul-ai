"""Dependency-free factories producing valid domain entities."""

from datetime import UTC, date, datetime
from uuid import UUID, uuid4

from app.domain.entities.conversation import Conversation
from app.domain.entities.document import Document, DocumentType
from app.domain.entities.experience import Experience
from app.domain.entities.formation import Formation
from app.domain.entities.message import Message, MessageRole
from app.domain.entities.profile import Profile
from app.domain.entities.project import Project
from app.domain.entities.technology import Technology

NOW = datetime(2026, 7, 28, tzinfo=UTC)


class ProfileFactory:
    """Build valid public profiles."""

    @staticmethod
    def build() -> Profile:
        return Profile(
            uuid4(),
            "Abdoul",
            "Backend Engineer",
            "Build reliable products.",
            "France",
            "contact@example.com",
            None,
            None,
            None,
            NOW,
            NOW,
        )


class FormationFactory:
    """Build valid formations."""

    @staticmethod
    def build(profile_id: UUID | None = None) -> Formation:
        return Formation(
            uuid4(),
            profile_id or uuid4(),
            "University",
            "Master",
            "Computer Science",
            "Advanced studies.",
            date(2024, 9, 1),
            date(2026, 6, 30),
            False,
            0,
            NOW,
            NOW,
        )


class ExperienceFactory:
    """Build valid professional experiences."""

    @staticmethod
    def build(profile_id: UUID | None = None) -> Experience:
        return Experience(
            uuid4(),
            profile_id or uuid4(),
            "Abdoul AI",
            "Engineer",
            "Backend engineering.",
            date(2024, 1, 1),
            None,
            True,
            0,
            NOW,
            NOW,
        )


class ProjectFactory:
    """Build valid projects with one technology."""

    @staticmethod
    def build(profile_id: UUID | None = None) -> Project:
        technology = Technology(uuid4(), "Python", "Backend", None, 0, NOW, NOW)
        return Project(
            uuid4(),
            profile_id or uuid4(),
            "abdoul-ai",
            "Abdoul AI",
            "Public platform.",
            "Detailed content.",
            None,
            None,
            None,
            True,
            0,
            NOW,
            NOW,
            (technology,),
        )


class DocumentFactory:
    """Build valid public document metadata."""

    @staticmethod
    def build(profile_id: UUID | None = None) -> Document:
        return Document(
            uuid4(),
            profile_id or uuid4(),
            "CV",
            "Public CV.",
            DocumentType.CV,
            "cv.pdf",
            "https://example.com/cv.pdf",
            "application/pdf",
            1024,
            True,
            0,
            NOW,
            NOW,
        )


class MessageFactory:
    """Build valid persisted messages."""

    @staticmethod
    def build(conversation_id: UUID | None = None) -> Message:
        return Message(
            uuid4(),
            conversation_id or uuid4(),
            MessageRole.USER,
            "Hello",
            NOW,
        )


class ConversationFactory:
    """Build valid conversations with immutable messages."""

    @staticmethod
    def build() -> Conversation:
        conversation_id = uuid4()
        message = MessageFactory.build(conversation_id)
        return Conversation(
            conversation_id,
            "session-factory",
            "Conversation",
            NOW,
            NOW,
            (message,),
        )
