"""Create the deterministic public profile used by local environments."""

import asyncio
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.infrastructure.database.engine import engine
from app.infrastructure.database.models.profile import Profile
from app.infrastructure.database.session import async_session_factory

PROFILE_ID = UUID("a8f4c8b4-0bd8-4f30-9cc8-5df1b356e741")


async def seed_profile(session: AsyncSession) -> bool:
    """Create the public profile once and return whether a row was inserted."""
    statement = select(Profile.id).where(Profile.id == PROFILE_ID)
    existing_profile_id = await session.scalar(statement)
    if existing_profile_id is not None:
        return False

    session.add(
        Profile(
            id=PROFILE_ID,
            name="Abdoul",
            title="AI & Backend Engineer",
            bio="Je conçois des produits numériques fiables, accessibles et centrés sur l'usage.",
            location="France",
            email="contact@abdoul-ai.dev",
            github_url="https://github.com/bonkanoar-png",
            linkedin_url=None,
            avatar_url=None,
        )
    )
    await session.commit()
    return True


async def run_seed() -> bool:
    """Run the profile seed with the configured application session."""
    try:
        async with async_session_factory() as session:
            return await seed_profile(session)
    finally:
        await engine.dispose()


def main() -> None:
    """Execute the seed and report its idempotent outcome."""
    created = asyncio.run(run_seed())
    if created:
        print("Public profile created.")
    else:
        print("Public profile already exists; no changes applied.")


if __name__ == "__main__":
    main()
