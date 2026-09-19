from typing import Any, Dict, List, Optional
from backend.config.config import scoring_config
from backend.schemas.module2_schema import PsychologicalFeatures, IndicatorItem
from backend.services.safety_engine import SafetyEngineResult


class RiskEngine:
    """
    Risk categorization engine.
    Maps SVI scores to standardized risk tiers and handles safety escalations.
    """

    def __init__(self, config: Optional[Dict[str, Any]] = None):
        self.config = config or scoring_config
        self.risk_levels = self.config.get("risk_levels", {})
        self.indicator_severity = self.config.get(
            "indicator_severity",
            {
                "low": {"min": 0, "max": 30},
                "moderate": {"min": 31, "max": 60},
                "high": {"min": 61, "max": 80},
                "critical": {"min": 81, "max": 100},
            },
        )

    def determine_risk_category(self, svi_score: float, safety_result: SafetyEngineResult) -> str:
        if safety_result.is_critical_override:
            return "CRITICAL"

        for key, level in self.risk_levels.items():
            min_val = level.get("min", 0)
            max_val = level.get("max", 100)
            if min_val <= svi_score <= max_val:
                return level.get("label", key.upper())

        if svi_score > 75:
            return "CRITICAL"
        if svi_score > 50:
            return "HIGH"
        if svi_score > 25:
            return "MODERATE"
        return "LOW"

    def determine_indicator_severity(self, score: float) -> str:
        for sev, bounds in self.indicator_severity.items():
            if bounds["min"] <= score <= bounds["max"]:
                return sev
        if score > 80:
            return "critical"
        if score > 60:
            return "high"
        if score > 30:
            return "moderate"
        return "low"

    def extract_indicator_items(self, features: PsychologicalFeatures) -> List[IndicatorItem]:
        feat_dict = features.model_dump()
        items: List[IndicatorItem] = []
        excluded = {"immediate_danger", "suicidal_ideation", "self_harm_indicator"}

        for name, score in feat_dict.items():
            if name not in excluded and score is not None:
                items.append(
                    IndicatorItem(
                        name=name,
                        score=round(float(score), 1),
                        severity=self.determine_indicator_severity(float(score)),
                    )
                )

        items.sort(key=lambda x: x.score, reverse=True)
        return items
