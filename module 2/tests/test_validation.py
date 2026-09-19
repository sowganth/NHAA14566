def test_invalid_negative_score(client):
    """Test 7a — Reject negative score (stress = -10). Expected: 422 Unprocessable Entity"""
    payload = {
        "case_id": "NHAA-ERR-001",
        "features": {
            "stress": -10
        }
    }
    response = client.post("/api/v1/assessment", json=payload)
    assert response.status_code == 422
    errors = response.json().get("detail", [])
    assert any("stress" in str(err) for err in errors)


def test_invalid_exceeding_score(client):
    """Test 7b — Reject score exceeding 100 (stress = 150). Expected: 422 Unprocessable Entity"""
    payload = {
        "case_id": "NHAA-ERR-002",
        "features": {
            "stress": 150
        }
    }
    response = client.post("/api/v1/assessment", json=payload)
    assert response.status_code == 422
    errors = response.json().get("detail", [])
    assert any("stress" in str(err) for err in errors)


def test_invalid_string_score(client):
    """Test 7c — Reject string score (stress = 'hello'). Expected: 422 Unprocessable Entity"""
    payload = {
        "case_id": "NHAA-ERR-003",
        "features": {
            "stress": "hello"
        }
    }
    response = client.post("/api/v1/assessment", json=payload)
    assert response.status_code == 422


def test_missing_required_case_id(client):
    """Test missing required case_id field. Expected: 422"""
    payload = {
        "features": {
            "stress": 50
        }
    }
    response = client.post("/api/v1/assessment", json=payload)
    assert response.status_code == 422


def test_forbid_unknown_extra_fields(client):
    """Test forbidding unexpected extra fields on AssessmentInput."""
    payload = {
        "case_id": "NHAA-ERR-005",
        "features": {
            "stress": 50
        },
        "unauthorized_field": "bad_data"
    }
    response = client.post("/api/v1/assessment", json=payload)
    assert response.status_code == 422
