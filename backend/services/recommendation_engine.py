from typing import Any, Dict, List, Optional, Tuple
from backend.config.config import scoring_config
from backend.services.safety_engine import SafetyEngineResult


class RecommendationEngine:
    """
    Recommendation Engine for Module 3 Support System.
    Generates non-clinical support priorities and suggested interventions for authorized human caseworkers.
    """

    def __init__(self, config: Optional[Dict[str, Any]] = None):
        self.config = config or scoring_config
        self.recommendations = self.config.get("recommendations", {})

    def get_recommendations(
        self,
        risk_category: str,
        safety_result: SafetyEngineResult,
    ) -> Tuple[str, List[str]]:
        if safety_result.priority_override:
            key = safety_result.priority_override
            rec = self.recommendations.get(key)
            if rec:
                return rec.get("priority", key), rec.get("suggested_support", [])
            return key, [
                "Mandatory immediate human caseworker review",
                "Emergency support protocol initiation",
                "Safety planning with caller/victim",
            ]

        rec = self.recommendations.get(risk_category.upper())
        if rec:
            return rec.get("priority", risk_category), rec.get("suggested_support", [])

        if risk_category.upper() == "CRITICAL":
            return "URGENT", [
                "Immediate human review",
                "Emergency support assessment",
                "Appropriate medical/mental-health support",
                "Appropriate police intervention where warranted",
            ]
        elif risk_category.upper() == "HIGH":
            return "HIGH_PRIORITY", [
                "Priority counselling",
                "Legal aid referral",
                "Medical support assessment",
                "Human case review",
            ]
        elif risk_category.upper() == "MODERATE":
            return "PRIORITY", [
                "Counselling referral",
                "Legal aid information",
                "Follow-up",
            ]
        else:
            return "ROUTINE", [
                "Information",
                "Optional counselling referral",
                "Follow-up",
            ]
