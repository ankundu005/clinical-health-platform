import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.database import get_db
from app.models.base import Base

# Use in-memory SQLite for testing
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"


# Fixture for creating a test database and tables
@pytest.fixture
async def test_db():
    # Create test engine
    engine = create_async_engine(TEST_DATABASE_URL, echo=True)
    
    # Create all tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Create session
    TestingSessionLocal = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    
    # Yield the session
    async with TestingSessionLocal() as session:
        yield session
    
    # Drop all tables after tests
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


# Override get_db dependency for tests
@pytest.fixture
def override_get_db(test_db):
    async def _override_get_db():
        yield test_db
    
    app.dependency_overrides[get_db] = _override_get_db
    yield
    app.dependency_overrides.clear()


# Test client fixture
@pytest.fixture
async def test_client(override_get_db):
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client


# Test health check endpoint
@pytest.mark.asyncio
async def test_health_check(test_client):
    response = await test_client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
