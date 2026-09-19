def test_health_endpoint(client):
    """Verify GET /health returns operational status and database connectivity."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["database"] == "connected"
    assert "model_version" in data


def test_config_endpoint(client):
    """Verify GET /api/v1/config returns non-sensitive scoring parameters."""
    response = client.get("/api/v1/config")
    assert response.status_code == 200
    data = response.json()
    assert "weights" in data
    assert "risk_levels" in data
    assert "safety_rule_keys" in data
    assert "model" in data


def test_batch_assessment(client):
    """Verify POST /api/v1/assessment/batch processes multiple cases."""
    batch_payload = {
        "cases": [
            {
                "case_id": "NHAA-BATCH-001",
                "features": {"stress": 15, "fear": 12}
            },
            {
                "case_id": "NHAA-BATCH-002",
                "features": {"stress": 85, "fear": 90, "threat": 88}
            }
        ]
    }
    response = client.post("/api/v1/assessment/batch", json=batch_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["total_processed"] == 2
    assert len(data["results"]) == 2
    assert data["results"][0]["case_id"] == "NHAA-BATCH-001"
    assert data["results"][1]["case_id"] == "NHAA-BATCH-002"


def test_get_assessment_by_case_id(client):
    """Verify persisting and retrieving assessment by case_id."""
    case_id = "NHAA-PERSIST-001"
    payload = {
        "case_id": case_id,
        "features": {"stress": 60, "fear": 65, "threat": 70}
    }
    create_res = client.post("/api/v1/assessment", json=payload)
    assert create_res.status_code == 200

    get_res = client.get(f"/api/v1/assessment/{case_id}")
    assert get_res.status_code == 200
    retrieved = get_res.json()
    assert retrieved["case_id"] == case_id
    assert retrieved["assessment"]["risk_category"] == "HIGH"


def test_get_nonexistent_assessment(client):
    """Verify 404 for non-existent case_id."""
    response = client.get("/api/v1/assessment/NON-EXISTENT-CASE-999")
    assert response.status_code == 404
