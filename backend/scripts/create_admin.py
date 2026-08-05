"""Create the first Abdoul AI CMS administrator."""

import argparse
import asyncio

from sqlalchemy import select

from app.infrastructure.database.engine import engine
from app.infrastructure.database.session import async_session_factory
from app.infrastructure.database.models.user_admin import (
    UserAdmin,
    AdminRole,
)
from app.security.admin_auth import hash_password


async def create_admin(email: str, password: str) -> bool:
    async with async_session_factory() as session:
        result = await session.execute(
            select(UserAdmin).where(UserAdmin.email == email)
        )

        existing = result.scalar_one_or_none()

        if existing:
            print(f"Admin already exists: {email}")
            return False

        admin = UserAdmin(
            email=email,
            password_hash=hash_password(password),
            role=AdminRole.ADMIN,
        )

        session.add(admin)
        await session.commit()

        print(f"Admin created: {email}")
        return True


async def main(email: str, password: str):
    try:
        await create_admin(email, password)
    finally:
        await engine.dispose()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()

    parser.add_argument(
        "--email",
        required=True,
        help="Administrator email",
    )

    parser.add_argument(
        "--password",
        required=True,
        help="Administrator password",
    )

    args = parser.parse_args()

    asyncio.run(
        main(
            args.email,
            args.password,
        )
    )
