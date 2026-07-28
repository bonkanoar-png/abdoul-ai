"""PostgreSQL and HTTP tests for conversation persistence."""

import asyncio
import os
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from datetime import UTC, datetime, timedelta
from uuid import uuid4

import pytest
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.schema import CreateSchema, DropSchema

from app.api.dependencies.conversation import get_conversation_service, get_message_service
from app.application.dto.conversation import ConversationDTO
from app.application.dto.message import MessageDTO
from app.domain.entities.conversation import Conversation
from app.domain.entities.message import Message, MessageRole
from app.infrastructure.database.base import Base
from app.infrastructure.database.models import Conversation as ConversationModel
from app.infrastructure.database.models import Message as MessageModel
from app.infrastructure.database.repositories.conversation_repository import (
    SQLAlchemyConversationRepository,
)
from app.infrastructure.database.repositories.message_repository import (
    SQLAlchemyMessageRepository,
)

NOW = datetime(2026, 7, 28, 10, 30, tzinfo=UTC)


@asynccontextmanager
async def isolated_postgres_session() -> AsyncIterator[AsyncSession]:
    database_url = os.getenv("TEST_DATABASE_URL")
    if not database_url:
        pytest.skip("TEST_DATABASE_URL is required for PostgreSQL integration tests.")
    schema = f"test_{uuid4().hex}"
    engine = create_async_engine(
        database_url, execution_options={"schema_translate_map": {None: schema}}
    )
    try:
        async with engine.begin() as connection:
            await connection.execute(CreateSchema(schema))
            await connection.run_sync(Base.metadata.create_all)
        session_factory = async_sessionmaker(engine, expire_on_commit=False)
        async with session_factory() as session:
            yield session
    finally:
        async with engine.begin() as connection:
            await connection.execute(DropSchema(schema, cascade=True))
        await engine.dispose()


class StubConversationService:
    def __init__(self, items: tuple[ConversationDTO, ...]) -> None:
        self.items = items

    async def get_conversations(self) -> tuple[ConversationDTO, ...]:
        return self.items


class StubMessageService:
    def __init__(self, items: tuple[MessageDTO, ...] | None) -> None:
        self.items = items

    async def get_messages(self, _conversation_id) -> tuple[MessageDTO, ...] | None:
        return self.items


def build_dtos() -> tuple[ConversationDTO, MessageDTO]:
    conversation_id = uuid4()
    message = MessageDTO(uuid4(), conversation_id, MessageRole.USER, "Hello", NOW)
    conversation = ConversationDTO(
        conversation_id,
        "session-1",
        "Conversation",
        NOW,
        NOW,
        (message,),
    )
    return conversation, message


def test_repositories_map_relations_and_order_results() -> None:
    async def scenario() -> None:
        async with isolated_postgres_session() as session:
            older = ConversationModel(
                session_id="older",
                title="Older",
                created_at=NOW - timedelta(days=1),
            )
            newer = ConversationModel(session_id="newer", title="Newer", created_at=NOW)
            newer.messages = [
                MessageModel(
                    role="ASSISTANT",
                    content="Second",
                    created_at=NOW + timedelta(seconds=1),
                ),
                MessageModel(role="USER", content="First", created_at=NOW),
            ]
            session.add_all([older, newer])
            await session.commit()
            newer_id = newer.id
            session.sync_session.expunge_all()

            conversations = await SQLAlchemyConversationRepository(session).get_conversations()
            messages = await SQLAlchemyMessageRepository(session).get_messages(newer_id)

            assert all(isinstance(item, Conversation) for item in conversations)
            assert [item.session_id for item in conversations] == ["newer", "older"]
            assert [item.content for item in conversations[0].messages] == ["First", "Second"]
            assert messages is not None
            assert all(isinstance(item, Message) for item in messages)
            assert [item.content for item in messages] == ["First", "Second"]

    asyncio.run(scenario())


def test_message_repository_distinguishes_empty_and_missing_conversation() -> None:
    async def scenario() -> None:
        async with isolated_postgres_session() as session:
            conversation = ConversationModel(session_id="empty", title=None)
            session.add(conversation)
            await session.commit()

            repository = SQLAlchemyMessageRepository(session)
            empty = await repository.get_messages(conversation.id)
            missing = await repository.get_messages(uuid4())

            assert empty == ()
            assert missing is None

    asyncio.run(scenario())


def test_conversations_endpoint_returns_data(api_client, override_dependency) -> None:
    conversation, _ = build_dtos()
    override_dependency(get_conversation_service, StubConversationService((conversation,)))
    response = api_client.get("/api/v1/conversations")

    assert response.status_code == 200
    assert response.json()[0]["title"] == "Conversation"


def test_conversations_endpoint_returns_empty_list(api_client, override_dependency) -> None:
    override_dependency(get_conversation_service, StubConversationService(()))
    response = api_client.get("/api/v1/conversations")

    assert response.status_code == 200
    assert response.json() == []


def test_messages_endpoint_returns_data_and_empty_list(api_client, override_dependency) -> None:
    conversation, message = build_dtos()
    override_dependency(get_message_service, StubMessageService((message,)))
    populated = api_client.get(f"/api/v1/conversations/{conversation.id}/messages")
    override_dependency(get_message_service, StubMessageService(()))
    empty = api_client.get(f"/api/v1/conversations/{conversation.id}/messages")

    assert populated.status_code == 200
    assert populated.json()[0]["role"] == "USER"
    assert empty.status_code == 200
    assert empty.json() == []


def test_messages_endpoint_returns_404_for_missing_conversation(
    api_client, override_dependency
) -> None:
    override_dependency(get_message_service, StubMessageService(None))
    response = api_client.get(f"/api/v1/conversations/{uuid4()}/messages")

    assert response.status_code == 404
    assert response.json() == {
        "error": {
            "code": "RESOURCE_NOT_FOUND",
            "message": "Conversation not found.",
            "details": None,
        }
    }
