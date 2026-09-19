from typing import Dict, Any


class Module2Service:
    """
    Module 2 — Stress & Vulnerability Index (SVI) Assessment Service
    Source of truth for SVI score (0-100), Risk Category, Risk Factors, and Safety Indicators.
    """

    @staticmethod
    def calculate_svi_assessment(module1_data: Dict[str, Any]) -> Dict[str, Any]:
        indicators = module1_data.get("detected_indicators", [])
        distress_level = module1_data.get("distress_level", "LOW")

        score = 20  # Base SVI score

        if "high fear indicator" in indicators:
            score += 25
        if "possible intimidation" in indicators:
            score += 20
        if "high distress indicator" in indicators:
            score += 20
        if "physical injury indicator" in indicators:
            score += 15
        if "atrocity vulnerability indicator" in indicators:
            score += 15

        svi = min(100, score)

        if svi >= 75 or distress_level == "CRITICAL":
            risk_category = "Critical"
            urgent_safety_indicator = True
            human_review_required = True
        elif svi >= 55:
            risk_category = "High"
            urgent_safety_indicator = "high fear indicator" in indicators
            human_review_required = True
        elif svi >= 35:
            risk_category = "Moderate"
            urgent_safety_indicator = False
            human_review_required = True
        else:
            risk_category = "Low"
            urgent_safety_indicator = False
            human_review_required = False

        return {
            "svi": svi,
            "risk_category": risk_category,
            "risk_factors": indicators,
            "human_review_required": human_review_required,
            "urgent_safety_indicator": urgent_safety_indicator,
            "assessment_mode": "demo"
        }
