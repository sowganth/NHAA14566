from datetime import datetime, timezone
from typing import Any, Optional
from sqlalchemy.orm import Session

from app.core.config import scoring_config
from app.core.logging import logger
from app.models.assessment import AssessmentRecord, RiskIndicatorRecord, AssessmentFlagRecord
from app.schemas.input import AssessmentInput
from app.schemas.output import (
    AssessmentOutput,
    AssessmentSummary,
    ModelMetadata,
)
from app.services.explainability import ExplainabilityService
from app.services.recommendation_engine import RecommendationEngine
from app.services.risk_engine import RiskEngine
from app.services.safety_engine import SafetyEngine
from app.services.svi_engine import SVIEngine


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
        """
        Process incoming structured indicators and return standardized SVI assessment.
        """
        features = assessment_input.features
        context = assessment_input.context

        # 1. Compute SVI Score, weights, and confidence
        svi_score, contributions, data_quality, confidence = self.svi_engine.evaluate(
            features, context
        )

        # 2. Evaluate Acute Safety Rules & Overrides
        safety_result = self.safety_engine.evaluate_safety(features, context)

        # 3. Categorize Risk
        risk_category = self.risk_engine.determine_risk_category(svi_score, safety_result)

        # 4. Determine Human-in-the-Loop Review Requirement
        human_review_required = safety_result.human_review_required or (risk_category == "CRITICAL")

        # 5. Extract Indicator Items
        indicators = self.risk_engine.extract_indicator_items(features)

        # 6. Generate Explainability Factors & Risk Flags
        contributing_factors, risk_flags = self.explainability_service.generate_explanations(
            features, context, contributions, safety_result
        )

        # 7. Generate Support Recommendations for Module 3
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

        # 8. Persist to Database if session provided
        if db is not None:
            self._save_to_database(db, assessment_input, output, safety_result)

        # 9. Audit Logging (PII-free)
        logger.info(
            f"Assessment generated: SVI={svi_score}, Risk={risk_category}, HumanReview={human_review_required}",
            extra={
                "case_id": assessment_input.case_id,
                "event_type": "ASSESSMENT_GENERATED",
                "risk_category": risk_category,
                "human_review_required": human_review_required,
            },
        )

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
            db.flush()  # populate record.id

            # Save indicators
            for ind in output.indicators:
                # Find matching contribution for weighted_contribution
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

            # Save flags
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
            # Do not re-raise to ensure API response availability even if DB has transient error
