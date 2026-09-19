from typing import Any, Dict, List, Optional, Tuple
from app.core.config import scoring_config
from app.schemas.input import PsychologicalFeatures
from app.schemas.output import IndicatorItem
from app.services.safety_engine import SafetyEngineResult


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
        """
        Determine risk category based on SVI score and safety overrides.
        """
        # Safety override takes precedence
        if safety_result.is_critical_override:
            return "CRITICAL"

        for key, level in self.risk_levels.items():
            min_val = level.get("min", 0)
            max_val = level.get("max", 100)
            if min_val <= svi_score <= max_val:
                return level.get("label", key.upper())

        # Fallback based on score boundary
        if svi_score > 75:
            return "CRITICAL"
        if svi_score > 50:
            return "HIGH"
        if svi_score > 25:
            return "MODERATE"
        return "LOW"

    def determine_indicator_severity(self, score: float) -> str:
        """
        Classify single indicator severity level: low, moderate, high, critical.
        """
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
        """
        Extract present psychological indicators sorted by score descending.
        """
        feat_dict = features.model_dump()
        items: List[IndicatorItem] = []

        # Exclude internal override flags from standard psychological indicator list
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

        # Sort highest score first
        items.sort(key=lambda x: x.score, reverse=True)
        return items
