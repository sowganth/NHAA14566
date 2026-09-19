from datetime import datetime, timezone
from typing import Any, Optional
from sqlalchemy.orm import Session
import logging

from backend.config.config import scoring_config
from backend.database.models import AssessmentRecord, RiskIndicatorRecord, AssessmentFlagRecord
from backend.schemas.module2_schema import (
    AssessmentInput,
    AssessmentOutput,
    AssessmentSummary,
    ModelMetadata,
)
from backend.services.explainability import ExplainabilityService
from backend.services.recommendation_engine import RecommendationEngine
from backend.services.risk_engine import RiskEngine
from backend.services.safety_engine import SafetyEngine
from backend.services.svi_engine import SVIEngine

logger = logging.getLogger(__name__)


class AssessmentCoordinator:
    """
    Coordinates the execution of SVI calculation, safety rules, risk categorization,
    explainability, recommendations, and persistence.
    """

    def __init__(self):
        self.svi_engine = SVIEngine(scoring_config)
        self.safety_engine = SafetyEngine(scoring_config)
        self.risk_engine = RiskEngine(scoring_config)
        self.explainability_service = ExplainabilityService()
        self.recommendation_engine = RecommendationEngine(scoring_config)

    def process_assessment(
        self,
        assessment_input: AssessmentInput,
        db: Optional[Session] = None,
    ) -> AssessmentOutput:
        features = assessment_input.features
        context = assessment_input.context

        svi_score, contributions, data_quality, confidence = self.svi_engine.evaluate(
            features, context
        )

        safety_result = self.safety_engine.evaluate_safety(features, context)

        risk_category = self.risk_engine.determine_risk_category(svi_score, safety_result)

        human_review_required = safety_result.human_review_required or (risk_category == "CRITICAL")

        indicators = self.risk_engine.extract_indicator_items(features)

        contributing_factors, risk_flags = self.explainability_service.generate_explanations(
            features, context, contributions, safety_result
        )

        recommended_priority, suggested_support = self.recommendation_engine.get_recommendations(
            risk_category, safety_result
        )

        now_utc = datetime.now(timezone.utc).isoformat()
        model_meta = ModelMetadata(
            name=scoring_config.get("model", {}).get("name", "SVI_RULE_ENGINE"),
            version=scoring_config.get("model", {}).get("version", "1.0.0"),
        )

        output = AssessmentOutput(
            case_id=assessment_input.case_id,
            assessment=AssessmentSummary(
                svi_score=svi_score,
                risk_category=risk_category,
                confidence=confidence,
                human_review_required=human_review_required,
            ),
            indicators=indicators,
            risk_flags=risk_flags,
            contributing_factors=contributing_factors,
            feature_contributions=contributions,
            recommended_priority=recommended_priority,
            suggested_support=suggested_support,
            data_quality=data_quality,
            model=model_meta,
            created_at=now_utc,
        )

        if db is not None:
            self._save_to_database(db, assessment_input, output, safety_result)

        return output

    def _save_to_database(
        self,
        db: Session,
        assessment_input: AssessmentInput,
        output: AssessmentOutput,
        safety_result: Any,
    ) -> None:
        try:
            record = AssessmentRecord(
                case_id=output.case_id,
                svi_score=output.assessment.svi_score,
                risk_category=output.assessment.risk_category,
                confidence=output.assessment.confidence,
                human_review_required=output.assessment.human_review_required,
                priority=output.recommended_priority,
                model_version=output.model.version,
                language=assessment_input.language,
            )
            db.add(record)
            db.flush()

            for ind in output.indicators:
                weighted_val = 0.0
                for c in output.feature_contributions:
                    if c.feature == ind.name:
                        weighted_val = c.weighted_contribution
                        break

                db.add(
                    RiskIndicatorRecord(
                        assessment_id=record.id,
                        indicator_name=ind.name,
                        raw_score=ind.score,
                        severity=ind.severity,
                        weighted_contribution=weighted_val,
                    )
                )

            for flag in output.risk_flags:
                trigger = ""
                for reason in safety_result.trigger_reasons:
                    if flag in reason:
                        trigger = reason
                        break
                db.add(
                    AssessmentFlagRecord(
                        assessment_id=record.id,
                        flag_type=flag,
                        severity="CRITICAL" if "DANGER" in flag or "SUICIDAL" in flag else "HIGH",
                        trigger_reason=trigger or "Detected threshold trigger",
                    )
                )

            db.commit()
        except Exception as e:
            db.rollback()
            logger.error(f"Failed to persist assessment to database: {str(e)}")
