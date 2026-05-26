from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base

from src.server.core._settings import settings

DATABASE_URL = str(settings.database_url)

engine = create_async_engine(
    DATABASE_URL,
    echo=True,  
    pool_pre_ping=True
)

AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    autoflush=False,
    expire_on_commit=False
)

Base = declarative_base()


async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
            # Automatically commit the transaction if the endpoint finishes with no errors
            await session.commit()
        except Exception:
            # Explicitly catch errors, rollback, and re-raise them
            await session.rollback()
            raise