def test_immediate_danger_override(client):
    """Test 5 — Immediate danger override: immediate_danger=True -> CRITICAL, human_review_required=True"""
    payload = {
        "case_id": "NHAA-TEST-IMM-005",
        "language": "en",
        "features": {
            "stress": 20,
            "trauma": 20,
            "fear": 20,
            "anxiety": 20,
            "immediate_danger": True
        }
    }

    response = client.post("/api/v1/assessment", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["assessment"]["risk_category"] == "CRITICAL"
    assert data["assessment"]["human_review_required"] is True
    assert data["recommended_priority"] == "URGENT_HUMAN_REVIEW"
    assert "IMMEDIATE_DANGER" in data["risk_flags"]


def test_immediate_danger_numeric_flag(client):
    """Test immediate_danger with numeric 1"""
    payload = {
        "case_id": "NHAA-TEST-IMM-NUM",
        "language": "en",
        "features": {
            "stress": 15,
            "immediate_danger": 1
        }
    }

    response = client.post("/api/v1/assessment", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["assessment"]["risk_category"] == "CRITICAL"
    assert data["assessment"]["human_review_required"] is True


def test_suicidal_ideation_override(client):
    """Test 8 — Suicidal ideation indicator: explicit high-risk indicator triggers safety pathway and human review."""
    payload = {
        "case_id": "NHAA-TEST-SI-008",
        "language": "en",
        "features": {
            "stress": 30,
            "trauma": 25,
            "suicidal_ideation": 75,
            "self_harm_indicator": 0
        }
    }

    response = client.post("/api/v1/assessment", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["assessment"]["risk_category"] == "CRITICAL"
    assert data["assessment"]["human_review_required"] is True
    assert data["recommended_priority"] == "URGENT_HUMAN_REVIEW"
    assert "SUICIDAL_IDEATION_DETECTED" in data["risk_flags"]
    assert any("suicidal ideation" in c.lower() for c in data["contributing_factors"])


def test_self_harm_override(client):
    """Test explicit self-harm indicator triggers acute safety pathway."""
    payload = {
        "case_id": "NHAA-TEST-SH-009",
        "language": "en",
        "features": {
            "stress": 25,
            "self_harm_indicator": 80
        }
    }

    response = client.post("/api/v1/assessment", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["assessment"]["risk_category"] == "CRITICAL"
    assert data["assessment"]["human_review_required"] is True
    assert "SELF_HARM_RISK_DETECTED" in data["risk_flags"]


def test_no_false_positive_suicide_from_sadness(client):
    """Verify that high sadness or trauma alone does NOT trigger suicidal ideation flag."""
    payload = {
        "case_id": "NHAA-TEST-SAD-010",
        "language": "en",
        "features": {
            "stress": 50,
            "trauma": 70,
            "sadness": 85,
            "suicidal_ideation": 0,
            "self_harm_indicator": 0
        }
    }

    response = client.post("/api/v1/assessment", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert "SUICIDAL_IDEATION_DETECTED" not in data["risk_flags"]
    assert "SELF_HARM_RISK_DETECTED" not in data["risk_flags"]
