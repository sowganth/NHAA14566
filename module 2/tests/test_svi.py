def test_low_risk_assessment(client):
    """Test 1 — Low risk: All psychological scores around 10–20. Expected: LOW"""
    payload = {
        "case_id": "NHAA-TEST-LOW-001",
        "language": "en",
        "features": {
            "stress": 15,
            "trauma": 12,
            "fear": 18,
            "anxiety": 14,
            "sadness": 10,
            "anger": 12,
            "social_isolation": 15,
            "intimidation": 10,
            "threat": 12,
            "helplessness": 15,
            "speech_distress": 10,
            "speech_hesitation": 15,
            "speech_instability": 12,
            "suicidal_ideation": 0,
            "self_harm_indicator": 0,
            "immediate_danger": 0
        },
        "context": {
            "violence_reported": False,
            "sexual_violence_reported": False,
            "murder_of_family_member": False,
            "displacement": False,
            "social_boycott": False,
            "ongoing_threat": False,
            "legal_delay": False
        }
    }

    response = client.post("/api/v1/assessment", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["case_id"] == "NHAA-TEST-LOW-001"
    assert data["assessment"]["risk_category"] == "LOW"
    assert data["assessment"]["svi_score"] <= 25.0
    assert data["assessment"]["human_review_required"] is False
    assert data["recommended_priority"] == "ROUTINE"
    assert len(data["indicators"]) > 0
    assert len(data["feature_contributions"]) > 0


def test_moderate_risk_assessment(client):
    """Test 2 — Moderate risk: Scores around 30–45. Expected: MODERATE"""
    payload = {
        "case_id": "NHAA-TEST-MOD-002",
        "language": "hi",
        "features": {
            "stress": 38,
            "trauma": 35,
            "fear": 42,
            "anxiety": 40,
            "sadness": 32,
            "anger": 30,
            "social_isolation": 35,
            "intimidation": 38,
            "threat": 40,
            "helplessness": 36,
            "speech_distress": 35,
            "speech_hesitation": 32,
            "speech_instability": 30,
            "suicidal_ideation": 0,
            "self_harm_indicator": 0,
            "immediate_danger": 0
        },
        "context": {
            "violence_reported": False,
            "sexual_violence_reported": False,
            "murder_of_family_member": False,
            "displacement": False,
            "social_boycott": False,
            "ongoing_threat": False,
            "legal_delay": True
        }
    }

    response = client.post("/api/v1/assessment", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["assessment"]["risk_category"] == "MODERATE"
    assert 26.0 <= data["assessment"]["svi_score"] <= 50.0
    assert data["recommended_priority"] == "PRIORITY"


def test_high_risk_assessment(client):
    """Test 3 — High risk: Scores around 55–70. Expected: HIGH"""
    payload = {
        "case_id": "NHAA-TEST-HIGH-003",
        "language": "ta",
        "features": {
            "stress": 65,
            "trauma": 62,
            "fear": 68,
            "anxiety": 64,
            "sadness": 55,
            "anger": 50,
            "social_isolation": 60,
            "intimidation": 65,
            "threat": 68,
            "helplessness": 62,
            "speech_distress": 60,
            "speech_hesitation": 58,
            "speech_instability": 55,
            "suicidal_ideation": 0,
            "self_harm_indicator": 0,
            "immediate_danger": 0
        },
        "context": {
            "violence_reported": True,
            "sexual_violence_reported": False,
            "murder_of_family_member": False,
            "displacement": True,
            "social_boycott": False,
            "ongoing_threat": True,
            "legal_delay": False
        }
    }

    response = client.post("/api/v1/assessment", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["assessment"]["risk_category"] == "HIGH"
    assert 51.0 <= data["assessment"]["svi_score"] <= 75.0
    assert data["recommended_priority"] == "HIGH_PRIORITY"


def test_critical_risk_assessment(client):
    """Test 4 — Critical risk: Scores around 80–95. Expected: CRITICAL"""
    payload = {
        "case_id": "NHAA-TEST-CRIT-004",
        "language": "te",
        "features": {
            "stress": 88,
            "trauma": 92,
            "fear": 95,
            "anxiety": 89,
            "sadness": 82,
            "anger": 75,
            "social_isolation": 85,
            "intimidation": 90,
            "threat": 92,
            "helplessness": 88,
            "speech_distress": 85,
            "speech_hesitation": 82,
            "speech_instability": 86,
            "suicidal_ideation": 0,
            "self_harm_indicator": 0,
            "immediate_danger": 0
        },
        "context": {
            "violence_reported": True,
            "sexual_violence_reported": False,
            "murder_of_family_member": False,
            "displacement": True,
            "social_boycott": True,
            "ongoing_threat": True,
            "legal_delay": True
        }
    }

    response = client.post("/api/v1/assessment", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["assessment"]["risk_category"] == "CRITICAL"
    assert data["assessment"]["svi_score"] >= 76.0
    assert data["assessment"]["human_review_required"] is True
    assert data["recommended_priority"] in ["URGENT", "URGENT_HUMAN_REVIEW"]


def test_missing_data_handling(client):
    """Test 6 — Missing data: Verify no crash, missing fields returned, confidence reduced appropriately."""
    payload = {
        "case_id": "NHAA-TEST-MISSING-006",
        "language": "en",
        "features": {
            "stress": 70,
            "fear": 80,
            "trauma": None,
            "anxiety": 65
        },
        "context": {
            "ongoing_threat": True
        }
    }

    response = client.post("/api/v1/assessment", json=payload)
    assert response.status_code == 200
    data = response.json()

    # Verify no crash
    assert "assessment" in data
    # Verify missing fields returned
    assert "trauma" in data["data_quality"]["missing_features"]
    assert "speech_instability" in data["data_quality"]["missing_features"]
    assert data["data_quality"]["completeness"] < 1.0
    # Verify confidence reduced
    assert data["assessment"]["confidence"] < 0.90
