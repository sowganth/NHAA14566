import pytest
from backend.services.support_recommendation_service import SupportRecommendationService


def test_recommendations_low_risk():
    recs = SupportRecommendationService.generate_recommendations(
        svi=20,
        risk_category="Low",
        risk_factors=["general inquiry indicator"],
        human_review_required=False,
        urgent_safety_indicator=False
    )
    assert len(recs) >= 2
    types = [r["type"] for r in recs]
    assert "SOCIAL_SUPPORT" in types
    assert "COUNSELLING" in types
    # Low risk items should not require mandatory human approval
    low_social = next(r for r in recs if r["type"] == "SOCIAL_SUPPORT")
    assert low_social["requires_human_approval"] is False


def test_recommendations_moderate_risk():
    recs = SupportRecommendationService.generate_recommendations(
        svi=45,
        risk_category="Moderate",
        risk_factors=["possible intimidation"],
        human_review_required=True,
        urgent_safety_indicator=False
    )
    types = [r["type"] for r in recs]
    assert "COUNSELLING" in types
    assert "LEGAL_AID" in types
    assert "SOCIAL_SUPPORT" in types


def test_recommendations_high_risk():
    recs = SupportRecommendationService.generate_recommendations(
        svi=68,
        risk_category="High",
        risk_factors=["high distress indicator", "possible intimidation"],
        human_review_required=True,
        urgent_safety_indicator=True
    )
    types = [r["type"] for r in recs]
    assert "EMERGENCY_HUMAN_REVIEW" in types
    assert "COUNSELLING" in types
    assert "LEGAL_AID" in types
    assert "FOLLOW_UP" in types


def test_recommendations_critical_risk():
    recs = SupportRecommendationService.generate_recommendations(
        svi=85,
        risk_category="Critical",
        risk_factors=["high fear indicator", "physical injury indicator"],
        human_review_required=True,
        urgent_safety_indicator=True
    )
    types = [r["type"] for r in recs]
    assert "EMERGENCY_HUMAN_REVIEW" in types
    assert "COUNSELLING" in types
    assert "LEGAL_AID" in types
    assert "WITNESS_PROTECTION_REVIEW" in types
    assert "MEDICAL_SUPPORT" in types
