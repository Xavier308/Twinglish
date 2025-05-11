import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import async_session
from app.models.user import User
from app.core.security import get_password_hash

async def create_user():
    async with async_session() as session:
        # Check if user already exists
        user = User(
            username="testuser",
            email="test@example.com",
            hashed_password=get_password_hash("Password123"),
            is_active=True
        )
        session.add(user)
        await session.commit()
        print("Test user created successfully!")

if __name__ == "__main__":
    asyncio.run(create_user())
