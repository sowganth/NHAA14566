import os
import pytest
from fastapi.testclient import TestClient

# Set test environment
os.environ["DATABASE_URL"] = "sqlite:///./test_svi.db"
os.environ["API_KEY_REQUIRED"] = "false"

from app.main import app
from app.models.database import Base, engine


@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)
    if os.path.exists("./test_svi.db"):
        try:
            os.remove("./test_svi.db")
        except Exception:
            pass


@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client
