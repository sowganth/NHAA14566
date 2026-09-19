from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, field_validator


VALID_RISK_CATEGORIES = {"Low", "Moderate", "High", "Critical"}
VALID_STATUSES = {
    "NEW", "UNDER_REVIEW", "ASSIGNED", "COUNSELLING_REFERRED",
    "LEGAL_AID_REFERRED", "MEDICAL_REVIEW", "POLICE_REVIEW",
    "PROTECTION_REVIEW", "FOLLOW_UP_REQUIRED", "RESOLVED", "CLOSED"
}
VALID_ROLES = {"ADMIN", "SUPERVISOR", "CASE_OFFICER", "COUNSELLOR", "LEGAL_SUPPORT", "READ_ONLY"}


class SupportRecommendationRequest(BaseModel):
    case_id: str = Field(..., json_schema_extra={"example": "DEMO-14566-001"})
    svi: int = Field(..., ge=0, le=100, json_schema_extra={"example": 78})
    risk_category: str = Field(..., json_schema_extra={"example": "Critical"})
    risk_factors: List[str] = Field(default_factory=list, json_schema_extra={"example": ["high fear indicator", "possible intimidation"]})
    human_review_required: bool = True
    urgent_safety_indicator: bool = False
    assessment_mode: Optional[str] = "demo"

    @field_validator("risk_category")
    def validate_risk_category(cls, v):
        if v not in VALID_RISK_CATEGORIES:
            raise ValueError(f"risk_category must be one of {sorted(VALID_RISK_CATEGORIES)}")
        return v


class SupportRecommendationItem(BaseModel):
    type: str
    priority: str
    label: str
    requires_human_approval: bool = True
    suggested_action: str


class SupportRecommendationResponse(BaseModel):
    case_id: str
    recommendations: List[SupportRecommendationItem]


class StatusUpdateRequest(BaseModel):
    status: str
    reason: str = Field(..., min_length=2)

    @field_validator("status")
    def validate_status(cls, v):
        if v not in VALID_STATUSES:
            raise ValueError(f"status must be one of {sorted(VALID_STATUSES)}")
        return v


class AssignCaseRequest(BaseModel):
    assigned_to: str = Field(..., min_length=1, json_schema_extra={"example": "OFFICER-001"})


class AddNoteRequest(BaseModel):
    note: str = Field(..., min_length=1)
    visibility: str = Field("AUTHORIZED_STAFF")


class CreateReferralRequest(BaseModel):
    referral_type: str = Field(..., json_schema_extra={"example": "COUNSELLING"})
    destination: str = Field(..., json_schema_extra={"example": "AUTHORIZED_SERVICE"})
    notes: Optional[str] = None


class CaseNoteOut(BaseModel):
    id: int
    case_id: str
    author_id: str
    note: str
    created_at: datetime
    visibility: str

    class Config:
        from_attributes = True


class ReferralOut(BaseModel):
    id: int
    case_id: str
    referral_type: str
    destination: str
    status: str
    created_at: datetime
    updated_at: datetime
    notes: Optional[str] = None

    class Config:
        from_attributes = True


class StatusHistoryOut(BaseModel):
    id: int
    case_id: str
    old_status: str
    new_status: str
    changed_by: str
    reason: str
    timestamp: datetime

    class Config:
        from_attributes = True


class SupportActionOut(BaseModel):
    id: int
    case_id: str
    action_type: str
    priority: str
    status: str
    assigned_to: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    due_at: Optional[datetime] = None
    notes: Optional[str] = None
    created_by: str
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class CaseDetailOut(BaseModel):
    case_id: str
    svi: int
    risk_category: str
    risk_factors: List[str]
    human_review_required: bool
    urgent_safety_indicator: bool
    status: str
    assigned_to: Optional[str] = None
    state: str
    district: str
    language: str
    input_type: str
    assessment_mode: str
    narrative_summary: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    risk_assessment: Dict[str, Any]
    recommendations: List[SupportRecommendationItem]
    notes: List[CaseNoteOut]
    referrals: List[ReferralOut]
    audit_history: List[StatusHistoryOut]
    support_actions: List[SupportActionOut]

    class Config:
        from_attributes = True


class CaseListItemOut(BaseModel):
    case_id: str
    svi: int
    risk_category: str
    human_review_required: bool
    urgent_safety_indicator: bool
    status: str
    assigned_to: Optional[str] = None
    state: str
    district: str
    language: str
    created_at: datetime

    class Config:
        from_attributes = True


class DashboardSummary(BaseModel):
    total_cases: int
    new_cases: int
    under_review: int
    follow_up_required: int
    high_priority: int
    human_review_required: int


class AuditLogOut(BaseModel):
    id: int
    user_id: str
    role: str
    case_id: Optional[str] = None
    action: str
    timestamp: datetime
    metadata_json: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True
