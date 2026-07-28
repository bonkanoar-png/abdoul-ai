"""Query-budget tests protecting explicit eager loading from N+1 regressions."""

import asyncio

from sqlalchemy import event

from app.infrastructure.database.models import Conversation, Message, Profile, Project, Skill
from app.infrastructure.database.repositories.conversation_repository import (
    SQLAlchemyConversationRepository,
)
from app.infrastructure.database.repositories.project_repository import (
    SQLAlchemyProjectRepository,
)
from tests.fixtures.database import isolated_postgres_session


def test_project_repository_uses_constant_query_budget() -> None:
    async def scenario() -> None:
        async with isolated_postgres_session() as session:
            profile = Profile(
                name="Abdoul",
                title="Engineer",
                bio="Build products.",
                location="France",
                email="contact@example.com",
            )
            technology = Skill(name="Python", category="Backend", sort_order=0)
            profile.projects = [
                Project(
                    slug=f"project-{index}",
                    title=f"Project {index}",
                    summary="Summary.",
                    description="Content.",
                    skills=[technology],
                )
                for index in range(3)
            ]
            session.add(profile)
            await session.commit()
            session.sync_session.expunge_all()

            query_count = 0

            def count_query(*_args: object) -> None:
                nonlocal query_count
                query_count += 1

            assert session.bind is not None
            event.listen(session.bind.sync_engine, "before_cursor_execute", count_query)
            try:
                projects = await SQLAlchemyProjectRepository(session).get_projects()
            finally:
                event.remove(session.bind.sync_engine, "before_cursor_execute", count_query)

            assert len(projects) == 3
            assert query_count == 2

    asyncio.run(scenario())


def test_conversation_repository_uses_constant_query_budget() -> None:
    async def scenario() -> None:
        async with isolated_postgres_session() as session:
            conversations = [
                Conversation(
                    session_id=f"session-{index}",
                    title=f"Conversation {index}",
                )
                for index in range(3)
            ]
            for conversation in conversations:
                conversation.messages = [Message(role="USER", content="Hello")]
            session.add_all(conversations)
            await session.commit()
            session.sync_session.expunge_all()

            query_count = 0

            def count_query(*_args: object) -> None:
                nonlocal query_count
                query_count += 1

            assert session.bind is not None
            event.listen(session.bind.sync_engine, "before_cursor_execute", count_query)
            try:
                result = await SQLAlchemyConversationRepository(session).get_conversations()
            finally:
                event.remove(session.bind.sync_engine, "before_cursor_execute", count_query)

            assert len(result) == 3
            assert query_count == 2

    asyncio.run(scenario())
