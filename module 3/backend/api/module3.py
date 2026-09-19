from fastapi import APIRouter, Depends, HTTPException, status, Query, Header
from sqlalchemy.orm import Session
from typing import List, Optional

from backend.database.connection import get_db
from backend.services.support_recommendation_service import SupportRecommendationService
from backend.services.case_service import CaseService
from backend.services.referral_service import ReferralService
from backend.services.audit_service import AuditService
from backend.services.auth_service import get_current_user, AuthContext, check_permission
from backend.schemas.module3 import (
    SupportRecommendationRequest, SupportRecommendationResponse,
    StatusUpdateRequest, AssignCaseRequest, AddNoteRequest, CreateReferralRequest,
    CaseDetailOut, CaseListItemOut, DashboardSummary, AuditLogOut, ReferralOut,
    CaseNoteOut, SupportActionOut
)

router = APIRouter(prefix="/api/v1/module3", tags=["Module 3 - Support & Case Management"])


@router.post("/recommend-support", response_model=SupportRecommendationResponse)
def recommend_support(req: SupportRecommendationRequest):
    """
    Generate transparent support recommendations from Module 2 SVI assessment input.
    """
    recs = SupportRecommendationService.generate_recommendations(
        svi=req.svi,
        risk_category=req.risk_category,
        risk_factors=req.risk_factors,
        human_review_required=req.human_review_required,
        urgent_safety_indicator=req.urgent_safety_indicator
    )

    items = [
        {
            "type": r["type"],
            "priority": r["priority"],
            "label": r["label"],
            "requires_human_approval": r["requires_human_approval"],
            "suggested_action": r["suggested_action"]
        }
        for r in recs
    ]

    return {
        "case_id": req.case_id,
        "recommendations": items
    }


@router.get("/dashboard", response_model=DashboardSummary)
def get_dashboard(
    db: Session = Depends(get_db),
    auth: AuthContext = Depends(get_current_user)
):
    """
    Get aggregate non-PII metrics for the authority dashboard.
    """
    check_permission(auth, {"ADMIN", "SUPERVISOR", "CASE_OFFICER", "COUNSELLOR", "LEGAL_SUPPORT", "READ_ONLY"})
    return CaseService.get_dashboard_summary(db)


@router.get("/cases", response_model=List[CaseListItemOut])
def list_cases(
    search: Optional[str] = Query(None, description="Search by Case ID"),
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
    """
    Get searchable/filterable list of cases.
    """
    check_permission(auth, {"ADMIN", "SUPERVISOR", "CASE_OFFICER", "COUNSELLOR", "LEGAL_SUPPORT", "READ_ONLY"})
    return CaseService.list_cases(
        db=db,
        search_case_id=search,
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
    """
    Get full details for a case.
    """
    check_permission(auth, {"ADMIN", "SUPERVISOR", "CASE_OFFICER", "COUNSELLOR", "LEGAL_SUPPORT", "READ_ONLY"})
    detail = CaseService.get_case(db=db, case_id=case_id, user_id=auth.user_id, user_role=auth.role)
    if not detail:
        raise HTTPException(status_code=404, detail="Case not found")
    return detail


@router.patch("/case/{case_id}/status")
def update_case_status(
    case_id: str,
    req: StatusUpdateRequest,
    db: Session = Depends(get_db),
    auth: AuthContext = Depends(get_current_user)
):
    """
    Update controlled case status and log history.
    """
    check_permission(auth, {"ADMIN", "SUPERVISOR", "CASE_OFFICER"})
    try:
        updated_case = CaseService.update_status(
            db=db,
            case_id=case_id,
            new_status=req.status,
            reason=req.reason,
            user_id=auth.user_id,
            user_role=auth.role
        )
        return {
            "case_id": updated_case.case_id,
            "status": updated_case.status,
            "updated_at": updated_case.updated_at
        }
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/case/{case_id}/assign")
def assign_case(
    case_id: str,
    req: AssignCaseRequest,
    db: Session = Depends(get_db),
    auth: AuthContext = Depends(get_current_user)
):
    """
    Assign a case to an officer or specialist.
    """
    check_permission(auth, {"ADMIN", "SUPERVISOR"})
    try:
        updated_case = CaseService.assign_case(
            db=db,
            case_id=case_id,
            assigned_to=req.assigned_to,
            user_id=auth.user_id,
            user_role=auth.role
        )
        return {
            "case_id": updated_case.case_id,
            "assigned_to": updated_case.assigned_to,
            "status": updated_case.status
        }
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/case/{case_id}/notes", response_model=CaseNoteOut)
def add_case_note(
    case_id: str,
    req: AddNoteRequest,
    db: Session = Depends(get_db),
    auth: AuthContext = Depends(get_current_user)
):
    """
    Add authorized case note.
    """
    check_permission(auth, {"ADMIN", "SUPERVISOR", "CASE_OFFICER", "COUNSELLOR", "LEGAL_SUPPORT"})
    try:
        return CaseService.add_note(
            db=db,
            case_id=case_id,
            note_text=req.note,
            visibility=req.visibility,
            user_id=auth.user_id,
            user_role=auth.role
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/case/{case_id}/referrals", response_model=ReferralOut)
def create_referral(
    case_id: str,
    req: CreateReferralRequest,
    db: Session = Depends(get_db),
    auth: AuthContext = Depends(get_current_user)
):
    """
    Create support referral.
    """
    check_permission(auth, {"ADMIN", "SUPERVISOR", "CASE_OFFICER"})
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
def get_all_referrals(
    db: Session = Depends(get_db),
    auth: AuthContext = Depends(get_current_user)
):
    check_permission(auth, {"ADMIN", "SUPERVISOR", "CASE_OFFICER", "COUNSELLOR", "LEGAL_SUPPORT", "READ_ONLY"})
    return ReferralService.get_all_referrals(db=db)


@router.get("/audit-logs", response_model=List[AuditLogOut])
def get_audit_logs(
    case_id: Optional[str] = Query(None),
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    auth: AuthContext = Depends(get_current_user)
):
    """
    Fetch system audit trail.
    """
    check_permission(auth, {"ADMIN", "SUPERVISOR"})
    return AuditService.get_audit_logs(db=db, case_id=case_id, limit=limit, offset=offset)
