import random
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database.connection import get_db
from backend.schemas.pipeline import FullPipelineRequest, FullPipelineResponse
from backend.services.module1_service import Module1Service
from backend.services.module2_service import Module2Service
from backend.services.case_service import CaseService
from backend.services.support_recommendation_service import SupportRecommendationService
from backend.services.auth_service import get_current_user, AuthContext

router = APIRouter(prefix="/api/v1/assessment", tags=["Full Pipeline Assessment"])


@router.post("/run", response_model=FullPipelineResponse)
def run_full_pipeline(
    req: FullPipelineRequest,
    db: Session = Depends(get_db),
    auth: AuthContext = Depends(get_current_user)
):
    """
    Executes the full pipeline: Module 1 -> Module 2 -> Module 3.
    Automatically generates case_id if not provided and creates the case record.
    """
    case_id = req.case_id or f"DEMO-14566-{random.randint(100, 999)}"

    # STEP 1: MODULE 1 INTERACTION ANALYSIS
    m1_res = Module1Service.analyze_interaction(
        state=req.state,
        district=req.district,
        language=req.language,
        input_type=req.input_type,
        narrative=req.narrative
    )

    # STEP 2: MODULE 2 SVI ASSESSMENT
    m2_res = Module2Service.calculate_svi_assessment(m1_res)

    # STEP 3: MODULE 3 SUPPORT RECOMMENDATION & CASE CREATION
    recs = SupportRecommendationService.generate_recommendations(
        svi=m2_res["svi"],
        risk_category=m2_res["risk_category"],
        risk_factors=m2_res["risk_factors"],
        human_review_required=m2_res["human_review_required"],
        urgent_safety_indicator=m2_res["urgent_safety_indicator"]
    )

    created_case = CaseService.create_case(
        db=db,
        case_id=case_id,
        svi=m2_res["svi"],
        risk_category=m2_res["risk_category"],
        risk_factors=m2_res["risk_factors"],
        human_review_required=m2_res["human_review_required"],
        urgent_safety_indicator=m2_res["urgent_safety_indicator"],
        state=req.state,
        district=req.district,
        language=req.language,
        input_type=req.input_type,
        assessment_mode=m2_res["assessment_mode"],
        narrative_summary=req.narrative,
        user_id=auth.user_id,
        user_role=auth.role
    )

    rec_labels = [r["label"] for r in recs]

    return {
        "case_id": created_case.case_id,
        "module1": m1_res,
        "module2": m2_res,
        "module3": {
            "status": created_case.status,
            "recommendations": rec_labels,
            "actions_count": len(recs)
        }
    }
