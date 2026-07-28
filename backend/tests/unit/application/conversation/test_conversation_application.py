"""Tests for conversation and message application flows."""

import asyncio
from datetime import UTC, datetime
from uuid import UUID, uuid4

from app.application.services.conversation_service import ConversationService
from app.application.services.message_service import MessageService
from app.application.use_cases.get_conversations import GetConversationsUseCase
from app.application.use_cases.get_messages import GetMessagesUseCase
from app.domain.entities.conversation import Conversation
from app.domain.entities.message import Message, MessageRole

NOW = datetime(2026, 7, 28, tzinfo=UTC)


class ConversationRepositoryStub:
    def __init__(self, conversation: Conversation) -> None:
        self.conversation = conversation

    async def get_conversations(self) -> tuple[Conversation, ...]:
        return (self.conversation,)


class MessageRepositoryStub:
    def __init__(self, messages: tuple[Message, ...] | None) -> None:
        self.messages = messages

    async def get_messages(self, _conversation_id: UUID) -> tuple[Message, ...] | None:
        return self.messages


def build_entities() -> tuple[Conversation, Message]:
    conversation_id = uuid4()
    message = Message(uuid4(), conversation_id, MessageRole.USER, "Hello", NOW)
    conversation = Conversation(
        conversation_id,
        "session-1",
        "Conversation",
        NOW,
        NOW,
        (message,),
    )
    return conversation, message


def test_conversation_application_flow_maps_nested_dto() -> None:
    conversation, _ = build_entities()
    use_case = GetConversationsUseCase(ConversationRepositoryStub(conversation))
    result = asyncio.run(ConversationService(use_case).get_conversations())

    assert result[0].session_id == "session-1"
    assert result[0].messages[0].role is MessageRole.USER


def test_message_application_flow_maps_dto_and_missing_conversation() -> None:
    conversation, message = build_entities()
    service = MessageService(GetMessagesUseCase(MessageRepositoryStub((message,))))
    missing_service = MessageService(GetMessagesUseCase(MessageRepositoryStub(None)))

    result = asyncio.run(service.get_messages(conversation.id))
    missing = asyncio.run(missing_service.get_messages(conversation.id))

    assert result is not None
    assert result[0].content == "Hello"
    assert missing is None
