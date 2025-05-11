import asyncio
import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import Column, String, Boolean, Integer, DateTime, func
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.orm import declarative_base
from passlib.context import CryptContext

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

# Base model
class BaseModel:
    @declared_attr
    def __tablename__(cls):
        return cls.__name__.lower()

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

Base = declarative_base(cls=BaseModel)

# User model
class User(Base):
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)

# Database connection
DATABASE_URL = os.environ.get("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@db:5432/twinglish")
engine = create_async_engine(DATABASE_URL)
async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def create_user():
    async with async_session() as session:
        try:
            # Create user
            user = User(
                username="testuser",
                email="test@example.com",
                hashed_password=get_password_hash("Password123"),
                is_active=True
            )
            session.add(user)
            await session.commit()
            print("Test user created successfully!")
        except Exception as e:
            await session.rollback()
            print(f"Error creating user: {e}")

if __name__ == "__main__":
    asyncio.run(create_user())
