import pytest
from pydantic import ValidationError
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient

from backend.main import app
from backend.database.connection import Base, get_db
from backend.schemas.module3 import SupportRecommendationRequest, StatusUpdateRequest

# Setup in-memory SQLite engine with StaticPool so all threads/sessions share the same schema
TEST_ENGINE = create_engine(
    "sqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=TEST_ENGINE)
Base.metadata.create_all(bind=TEST_ENGINE)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


def test_invalid_svi_out_of_range():
    with pytest.raises(ValidationError):
        SupportRecommendationRequest(
            case_id="INVALID-01",
            svi=150,
            risk_category="High",
            risk_factors=[]
        )

    with pytest.raises(ValidationError):
        SupportRecommendationRequest(
            case_id="INVALID-02",
            svi=-10,
            risk_category="High",
            risk_factors=[]
        )


def test_invalid_risk_category():
    with pytest.raises(ValidationError):
        SupportRecommendationRequest(
            case_id="INVALID-03",
            svi=50,
            risk_category="EXTREME_DANGER",
            risk_factors=[]
        )


def test_invalid_status_enum():
    with pytest.raises(ValidationError):
        StatusUpdateRequest(
            status="INVALID_STATUS_STRING",
            reason="Test reason"
        )


def test_authorization_check():
    response = client.patch(
        "/api/v1/module3/case/DEMO-14566-001/status",
        json={"status": "UNDER_REVIEW", "reason": "Attempt by read only user"},
        headers={"x-user-id": "READONLY-01", "x-user-role": "READ_ONLY"}
    )
    assert response.status_code == 403


def test_full_pipeline_integration():
    payload = {
        "state": "Tamil Nadu",
        "district": "Chennai",
        "language": "Tamil",
        "input_type": "text",
        "narrative": "Urgent help needed. Receiving threats and high fear in locality."
    }
    response = client.post("/api/v1/assessment/run", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "case_id" in data
    assert data["module1"]["language"] == "Tamil"
    assert data["module2"]["risk_category"] in ["High", "Critical"]
    assert data["module3"]["status"] == "NEW"
    assert len(data["module3"]["recommendations"]) > 0


def test_health_check_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"
    assert response.json()["module"] == "module3"
