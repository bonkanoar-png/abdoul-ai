"""Contract tests for shared domain factories."""

from app.domain.entities.conversation import Conversation
from app.domain.entities.document import Document
from app.domain.entities.experience import Experience
from app.domain.entities.formation import Formation
from app.domain.entities.message import Message
from app.domain.entities.profile import Profile
from app.domain.entities.project import Project
from tests.factories import (
    ConversationFactory,
    DocumentFactory,
    ExperienceFactory,
    FormationFactory,
    MessageFactory,
    ProfileFactory,
    ProjectFactory,
)


def test_factories_produce_valid_domain_entities() -> None:
    assert isinstance(ProfileFactory.build(), Profile)
    assert isinstance(FormationFactory.build(), Formation)
    assert isinstance(ExperienceFactory.build(), Experience)
    assert isinstance(ProjectFactory.build(), Project)
    assert isinstance(DocumentFactory.build(), Document)
    assert isinstance(ConversationFactory.build(), Conversation)
    assert isinstance(MessageFactory.build(), Message)
