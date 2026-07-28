"""Tests for the conversation domain entity."""

from datetime import UTC, datetime
from typing import cast
from uuid import uuid4

import pytest

from app.domain.entities.conversation import Conversation
from app.domain.entities.message import Message, MessageRole
from app.domain.exceptions.portfolio import InvalidConversation

NOW = datetime(2026, 7, 28, tzinfo=UTC)


def build_conversation(
    *,
    session_id: str = "session-1",
    title: str | None = "Conversation",
    messages: tuple[Message, ...] = (),
) -> Conversation:
    return Conversation(uuid4(), session_id, title, NOW, NOW, messages)


def test_conversation_accepts_valid_data_and_freezes_messages() -> None:
    conversation_id = uuid4()
    message = Message(uuid4(), conversation_id, MessageRole.USER, "Hello", NOW)
    conversation = build_conversation(messages=cast(tuple[Message, ...], [message]))

    assert isinstance(conversation.messages, tuple)
    assert conversation.messages == (message,)


def test_conversation_requires_session_id() -> None:
    with pytest.raises(InvalidConversation):
        build_conversation(session_id=" ")


def test_conversation_rejects_blank_optional_title() -> None:
    with pytest.raises(InvalidConversation):
        build_conversation(title="")
