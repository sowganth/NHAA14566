import random
import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.database.connection import get_db
from backend.schemas.pipeline_schema import FullPipelineRequest, FullPipelineResponse
from backend.schemas.module2_schema import AssessmentInput, PsychologicalFeatures, ContextFactors
from backend.services.text_analyzer import analyze_text_interaction
from backend.services.voice_analyzer import analyze_voice_interaction
from backend.services.coordinator import AssessmentCoordinator
from backend.services.support_recommendation_service import SupportRecommendationService
from backend.services.case_service import CaseService
from backend.services.auth_service import get_current_user, AuthContext

router = APIRouter(prefix="/api/v1/assessment", tags=["Full Pipeline Assessment"])
coordinator = AssessmentCoordinator()


@router.post("/run", response_model=FullPipelineResponse)
def run_full_pipeline(
    req: FullPipelineRequest,
    db: Session = Depends(get_db),
    auth: AuthContext = Depends(get_current_user)
):
    """
    Executes the full pipeline: MODULE 1 -> MODULE 2 -> MODULE 3.
    Uses common case_id across all modules and persists everything to shared SQLite app.db.
    """
    case_id = req.case_id or f"DEMO-14566-{random.randint(100, 999)}"

    # STEP 1: MODULE 1 INTERACTION ANALYSIS (Real NLP/Voice)
    if req.input_type.lower() in ["voice", "voice/text"]:
        m1_res = analyze_voice_interaction(
            transcript_text=req.narrative,
            language=req.language,
            case_id=case_id
        )
    else:
        m1_res = analyze_text_interaction(
            text=req.narrative,
            language=req.language,
            case_id=case_id
        )

    # STEP 2: MODULE 2 STRESS & VULNERABILITY INDEX (SVI ENGINE)
    emotions = m1_res.get("emotion_scores", {})
    speech = m1_res.get("speech_features") or {}
    urgent_safety = m1_res.get("urgent_safety_indicators", [])
    trauma = m1_res.get("trauma_indicators", [])

    features = PsychologicalFeatures(
        stress=float(emotions.get("distress", 40)),
        anxiety=float(emotions.get("anxiety", 30)),
        fear=float(emotions.get("fear", 30)),
        sadness=float(emotions.get("sadness", 20)),
        anger=float(emotions.get("anger", 15)),
        threat=80.0 if any("threat" in t.lower() for t in trauma) else 20.0,
        intimidation=75.0 if any("intimidation" in t.lower() for t in trauma) else 15.0,
        social_isolation=70.0 if any("isolation" in v.lower() for v in m1_res.get("vulnerability_indicators", [])) else 10.0,
        speech_distress=float(speech.get("intensity", 50)) if speech else None,
        speech_hesitation=float(speech.get("hesitation", 40)) if speech else None,
        speech_instability=float(speech.get("pitch_variation", 30)) if speech else None,
        immediate_danger=1.0 if any("immediate danger" in u.lower() or "weapon" in u.lower() for u in urgent_safety) else 0.0,
        suicidal_ideation=80.0 if any("suicide" in u.lower() or "self-harm" in u.lower() for u in urgent_safety) else 0.0
    )

    context = ContextFactors(
        violence_reported=any("violence" in ind.lower() or "attack" in ind.lower() for ind in m1_res.get("indicators", [])),
        ongoing_threat=any("threat" in t.lower() for t in trauma),
        displacement=any("isolation" in v.lower() for v in m1_res.get("vulnerability_indicators", []))
    )

    m2_input = AssessmentInput(
        case_id=case_id,
        language=req.language,
        features=features,
        context=context
    )

    m2_output = coordinator.process_assessment(m2_input, db=db)

    m2_dict = {
        "svi": int(m2_output.assessment.svi_score),
        "risk_category": m2_output.assessment.risk_category,
        "risk_factors": m2_output.contributing_factors,
        "human_review_required": m2_output.assessment.human_review_required,
        "urgent_safety_indicator": len(m2_output.risk_flags) > 0,
        "assessment_mode": "live_rule_engine",
        "confidence": m2_output.assessment.confidence,
        "recommended_priority": m2_output.recommended_priority,
        "suggested_support": m2_output.suggested_support
    }

    # STEP 3: MODULE 3 SUPPORT RECOMMENDATION & CASE PERSISTENCE
    recs_raw = SupportRecommendationService.generate_recommendations(
        svi=m2_dict["svi"],
        risk_category=m2_dict["risk_category"],
        risk_factors=m2_dict["risk_factors"],
        human_review_required=m2_dict["human_review_required"],
        urgent_safety_indicator=m2_dict["urgent_safety_indicator"]
    )

    created_case = CaseService.create_case(
        db=db,
        case_id=case_id,
        svi=m2_dict["svi"],
        risk_category=m2_dict["risk_category"],
        risk_factors=m2_dict["risk_factors"],
        human_review_required=m2_dict["human_review_required"],
        urgent_safety_indicator=m2_dict["urgent_safety_indicator"],
        state=req.state,
        district=req.district,
        language=req.language,
        input_type=req.input_type,
        assessment_mode=m2_dict["assessment_mode"],
        narrative_summary=req.narrative,
        user_id=auth.user_id,
        user_role=auth.role
    )

    rec_labels = [r["label"] for r in recs_raw]

    return {
        "case_id": case_id,
        "module1": m1_res,
        "module2": m2_dict,
        "module3": {
            "status": created_case.status,
            "recommendations": rec_labels,
            "actions_count": len(recs_raw)
        }
    }
