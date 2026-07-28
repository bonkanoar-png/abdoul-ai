"""Tests for the message domain entity."""

from datetime import UTC, datetime
from typing import cast
from uuid import uuid4

import pytest

from app.domain.entities.message import Message, MessageRole
from app.domain.exceptions.portfolio import InvalidMessage

NOW = datetime(2026, 7, 28, tzinfo=UTC)


@pytest.mark.parametrize("role", list(MessageRole))
def test_message_accepts_supported_roles(role: MessageRole) -> None:
    message = Message(uuid4(), uuid4(), role, "Content", NOW)

    assert message.role is role


def test_message_requires_content() -> None:
    with pytest.raises(InvalidMessage):
        Message(uuid4(), uuid4(), MessageRole.USER, " ", NOW)


def test_message_rejects_unsupported_role() -> None:
    with pytest.raises(InvalidMessage):
        Message(uuid4(), uuid4(), cast(MessageRole, "TOOL"), "Content", NOW)
