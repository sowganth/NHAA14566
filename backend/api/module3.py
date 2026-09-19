from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from backend.database.connection import get_db
from backend.schemas.module3_schema import (
    SupportRecommendationRequest,
    SupportRecommendationResponse,
    SupportRecommendationItem,
    StatusUpdateRequest,
    AssignCaseRequest,
    AddNoteRequest,
    CreateReferralRequest,
    CaseDetailOut,
    CaseListItemOut,
    DashboardSummary,
    CaseNoteOut,
    ReferralOut,
    AuditLogOut,
)
from backend.services.support_recommendation_service import SupportRecommendationService
from backend.services.case_service import CaseService
from backend.services.referral_service import ReferralService
from backend.services.audit_service import AuditService
from backend.services.auth_service import get_current_user, AuthContext

router = APIRouter(prefix="/api/v1/module3", tags=["Module 3 - Support & Case Management"])


@router.post("/recommend-support", response_model=SupportRecommendationResponse)
def recommend_support(req: SupportRecommendationRequest):
    recs_raw = SupportRecommendationService.generate_recommendations(
        svi=req.svi,
        risk_category=req.risk_category,
        risk_factors=req.risk_factors,
        human_review_required=req.human_review_required,
        urgent_safety_indicator=req.urgent_safety_indicator
    )
    items = [SupportRecommendationItem(**r) for r in recs_raw]
    return SupportRecommendationResponse(case_id=req.case_id, recommendations=items)


@router.get("/dashboard/summary", response_model=DashboardSummary)
def get_dashboard_summary(
    db: Session = Depends(get_db),
    auth: AuthContext = Depends(get_current_user)
):
    return CaseService.get_dashboard_summary(db)


@router.get("/cases", response_model=List[CaseListItemOut])
def list_cases(
    search_case_id: Optional[str] = Query(None),
    risk_category: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    language: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    district: Optional[str] = Query(None),
    assigned_to: Optional[str] = Query(None),
    human_review_required: Optional[bool] = Query(None),
    urgent_safety_indicator: Optional[bool] = Query(None),
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    auth: AuthContext = Depends(get_current_user)
):
    return CaseService.list_cases(
        db=db,
        search_case_id=search_case_id,
        risk_category=risk_category,
        status=status,
        language=language,
        state=state,
        district=district,
        assigned_to=assigned_to,
        human_review_required=human_review_required,
        urgent_safety_indicator=urgent_safety_indicator,
        limit=limit,
        offset=offset
    )


@router.get("/case/{case_id}", response_model=CaseDetailOut)
def get_case_detail(
    case_id: str,
    db: Session = Depends(get_db),
    auth: AuthContext = Depends(get_current_user)
):
    detail = CaseService.get_case(db=db, case_id=case_id, user_id=auth.user_id, user_role=auth.role)
    if not detail:
        raise HTTPException(status_code=404, detail=f"Case with ID '{case_id}' not found.")
    return detail


@router.patch("/case/{case_id}/status")
def update_case_status(
    case_id: str,
    req: StatusUpdateRequest,
    db: Session = Depends(get_db),
    auth: AuthContext = Depends(get_current_user)
):
    try:
        updated = CaseService.update_status(
            db=db,
            case_id=case_id,
            new_status=req.status,
            reason=req.reason,
            user_id=auth.user_id,
            user_role=auth.role
        )
        return {"message": "Status updated successfully", "case_id": updated.case_id, "new_status": updated.status}
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))


@router.post("/case/{case_id}/assign")
def assign_case(
    case_id: str,
    req: AssignCaseRequest,
    db: Session = Depends(get_db),
    auth: AuthContext = Depends(get_current_user)
):
    try:
        updated = CaseService.assign_case(
            db=db,
            case_id=case_id,
            assigned_to=req.assigned_to,
            user_id=auth.user_id,
            user_role=auth.role
        )
        return {"message": f"Case assigned to {req.assigned_to}", "case_id": updated.case_id, "assigned_to": updated.assigned_to}
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))


@router.post("/case/{case_id}/notes", response_model=CaseNoteOut)
def add_case_note(
    case_id: str,
    req: AddNoteRequest,
    db: Session = Depends(get_db),
    auth: AuthContext = Depends(get_current_user)
):
    try:
        return CaseService.add_note(
            db=db,
            case_id=case_id,
            note_text=req.note,
            visibility=req.visibility,
            user_id=auth.user_id,
            user_role=auth.role
        )
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))


@router.post("/case/{case_id}/referral", response_model=ReferralOut)
def create_referral(
    case_id: str,
    req: CreateReferralRequest,
    db: Session = Depends(get_db),
    auth: AuthContext = Depends(get_current_user)
):
    return ReferralService.create_referral(
        db=db,
        case_id=case_id,
        referral_type=req.referral_type,
        destination=req.destination,
        notes=req.notes,
        user_id=auth.user_id,
        role=auth.role
    )


@router.get("/referrals", response_model=List[ReferralOut])
def get_referrals(
    db: Session = Depends(get_db),
    auth: AuthContext = Depends(get_current_user)
):
    return ReferralService.get_all_referrals(db=db)


@router.get("/audit-logs", response_model=List[AuditLogOut])
def get_audit_logs(
    case_id: Optional[str] = Query(None),
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    auth: AuthContext = Depends(get_current_user)
):
    return AuditService.get_audit_logs(db=db, case_id=case_id, limit=limit, offset=offset)
