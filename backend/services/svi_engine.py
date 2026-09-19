from typing import Any, Dict, List, Optional, Tuple
from backend.config.config import scoring_config
from backend.schemas.module2_schema import ContextFactors, PsychologicalFeatures, DataQuality, FeatureContribution


class SVIEngine:
    """
    Stress Vulnerability Index (SVI) calculation engine.
    Implements transparent, deterministic weighted scoring with missing-data reweighting.
    """

    def __init__(self, config: Optional[Dict[str, Any]] = None):
        self.config = config or scoring_config
        self.weights = self.config.get("weights", {})
        self.context_weights = self.config.get("context_weights", {})

    def compute_contextual_risk(self, context: Optional[ContextFactors]) -> float:
        """
        Compute contextual risk score (0-100) from discrete atrocity/incident context flags.
        """
        if not context:
            return 0.0

        ctx_dict = context.model_dump()
        total_weight = sum(self.context_weights.values()) or 1.0
        weighted_sum = 0.0

        for key, weight in self.context_weights.items():
            val = ctx_dict.get(key, False)
            if val:
                weighted_sum += weight * 100.0

        return min(100.0, max(0.0, weighted_sum / total_weight))

    def evaluate(
        self, features: PsychologicalFeatures, context: Optional[ContextFactors]
    ) -> Tuple[float, List[FeatureContribution], DataQuality, float]:
        """
        Evaluate SVI score, feature contributions, data quality, and confidence.
        Returns:
            (svi_score, feature_contributions, data_quality, confidence)
        """
        feat_dict = features.model_dump()

        eval_factors: Dict[str, Optional[float]] = {}
        has_context = context is not None and any(
            v is not None and v is not False for v in context.model_dump().values()
        )
        contextual_risk = self.compute_contextual_risk(context) if has_context else None

        for feat_name, weight in self.weights.items():
            if feat_name == "contextual_risk":
                eval_factors[feat_name] = contextual_risk
            elif feat_name == "displacement":
                if feat_dict.get("displacement") is not None:
                    eval_factors[feat_name] = feat_dict["displacement"]
                elif context and context.displacement:
                    eval_factors[feat_name] = 100.0
                elif has_context:
                    eval_factors[feat_name] = 0.0
                else:
                    eval_factors[feat_name] = None
            elif feat_name == "ongoing_threat":
                if feat_dict.get("ongoing_threat") is not None:
                    eval_factors[feat_name] = feat_dict["ongoing_threat"]
                elif context and context.ongoing_threat:
                    eval_factors[feat_name] = 100.0
                elif has_context:
                    eval_factors[feat_name] = 0.0
                else:
                    eval_factors[feat_name] = None
            else:
                eval_factors[feat_name] = feat_dict.get(feat_name)

        expected_features = [k for k in self.weights.keys()]
        missing_features: List[str] = []
        present_features: Dict[str, float] = {}

        for k in expected_features:
            val = eval_factors.get(k)
            if val is None:
                missing_features.append(k)
            else:
                present_features[k] = float(val)

        total_expected = len(expected_features)
        present_count = len(present_features)
        completeness = round(present_count / total_expected, 3) if total_expected > 0 else 1.0

        sum_present_weights = sum(self.weights[k] for k in present_features.keys())

        feature_contributions: List[FeatureContribution] = []
        raw_svi = 0.0

        if sum_present_weights > 0:
            for k in expected_features:
                orig_weight = self.weights[k]
                if k in present_features:
                    normalized_weight = orig_weight / sum_present_weights
                    contribution = present_features[k] * normalized_weight
                    raw_svi += contribution
                    feature_contributions.append(
                        FeatureContribution(
                            feature=k,
                            raw_score=round(present_features[k], 2),
                            weight=round(normalized_weight, 4),
                            weighted_contribution=round(contribution, 2),
                        )
                    )
                else:
                    feature_contributions.append(
                        FeatureContribution(
                            feature=k,
                            raw_score=None,
                            weight=round(orig_weight, 4),
                            weighted_contribution=0.0,
                        )
                    )
        else:
            raw_svi = 0.0

        final_svi = round(min(100.0, max(0.0, raw_svi)), 2)

        confidence = self._calculate_confidence(
            completeness=completeness,
            missing_features=missing_features,
            present_features=present_features,
        )

        data_quality = DataQuality(
            completeness=completeness,
            missing_features=missing_features,
        )

        return final_svi, feature_contributions, data_quality, confidence

    def _calculate_confidence(
        self,
        completeness: float,
        missing_features: List[str],
        present_features: Dict[str, float],
    ) -> float:
        conf = 0.60 * completeness
        core_indicators = ["fear", "threat", "trauma", "stress"]
        core_present = sum(1 for c in core_indicators if c in present_features)
        conf += 0.30 * (core_present / len(core_indicators))

        if "fear" in present_features and "anxiety" in present_features:
            diff = abs(present_features["fear"] - present_features["anxiety"])
            if diff < 40:
                conf += 0.10
            else:
                conf += 0.05
        else:
            conf += 0.05

        return round(min(0.98, max(0.10, conf)), 2)
