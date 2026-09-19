from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.config.config import scoring_config
from backend.database.connection import get_db
from backend.database.models import AssessmentRecord
from backend.schemas.module2_schema import (
    AssessmentInput,
    BatchAssessmentInput,
    AssessmentOutput,
    BatchAssessmentOutput,
    ConfigResponse,
    AssessmentSummary,
    IndicatorItem,
    DataQuality,
    ModelMetadata,
)
from backend.services.coordinator import AssessmentCoordinator

router = APIRouter(prefix="/api/v1/module2", tags=["Module 2 - SVI Assessment Engine"])
coordinator = AssessmentCoordinator()


@router.post("/assess", response_model=AssessmentOutput, status_code=status.HTTP_200_OK)
def create_assessment(
    payload: AssessmentInput,
    db: Session = Depends(get_db)
) -> AssessmentOutput:
    try:
        return coordinator.process_assessment(payload, db=db)
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(ve))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while computing assessment: {str(e)}",
        )


@router.post("/assess/batch", response_model=BatchAssessmentOutput, status_code=status.HTTP_200_OK)
def batch_assessment(
    payload: BatchAssessmentInput,
    db: Session = Depends(get_db)
) -> BatchAssessmentOutput:
    results: List[AssessmentOutput] = []
    for item in payload.cases:
        res = coordinator.process_assessment(item, db=db)
        results.append(res)

    return BatchAssessmentOutput(
        total_processed=len(results),
        results=results,
    )


@router.get("/assess/{case_id}", response_model=AssessmentOutput)
def get_assessment(
    case_id: str,
    db: Session = Depends(get_db)
) -> AssessmentOutput:
    record = (
        db.query(AssessmentRecord)
        .filter(AssessmentRecord.case_id == case_id)
        .order_by(AssessmentRecord.created_at.desc())
        .first()
    )

    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No assessment found for case_id: {case_id}",
        )

    indicators = [
        IndicatorItem(
            name=ind.indicator_name,
            score=ind.raw_score or 0.0,
            severity=ind.severity,
        )
        for ind in record.indicators
    ]

    flags = [f.flag_type for f in record.flags]

    return AssessmentOutput(
        case_id=record.case_id,
        assessment=AssessmentSummary(
            svi_score=record.svi_score,
            risk_category=record.risk_category,
            confidence=record.confidence,
            human_review_required=record.human_review_required,
        ),
        indicators=indicators,
        risk_flags=flags,
        contributing_factors=[f.trigger_reason for f in record.flags if f.trigger_reason],
        feature_contributions=[],
        recommended_priority=record.priority,
        suggested_support=[],
        data_quality=DataQuality(completeness=1.0, missing_features=[]),
        model=ModelMetadata(name="SVI_RULE_ENGINE", version=record.model_version),
        created_at=record.created_at.isoformat(),
    )


@router.get("/config", response_model=ConfigResponse)
def get_configuration() -> ConfigResponse:
    return ConfigResponse(
        model=ModelMetadata(
            name=scoring_config.get("model", {}).get("name", "SVI_RULE_ENGINE"),
            version=scoring_config.get("model", {}).get("version", "1.0.0"),
        ),
        weights=scoring_config.get("weights", {}),
        context_weights=scoring_config.get("context_weights", {}),
        risk_levels=scoring_config.get("risk_levels", {}),
        safety_rule_keys=list(scoring_config.get("safety_rules", {}).keys()),
    )
