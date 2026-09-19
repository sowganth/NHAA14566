from datetime import datetime
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from backend.database.models import Case, SupportAction, CaseStatusHistory, CaseNote, Referral
from backend.services.support_recommendation_service import SupportRecommendationService
from backend.services.audit_service import AuditService


class CaseService:
    @staticmethod
    def create_case(
        db: Session,
        case_id: str,
        svi: int,
        risk_category: str,
        risk_factors: List[str],
        human_review_required: bool = True,
        urgent_safety_indicator: bool = False,
        state: str = "Tamil Nadu",
        district: str = "Chennai",
        language: str = "Tamil",
        input_type: str = "text",
        assessment_mode: str = "demo",
        narrative_summary: Optional[str] = None,
        user_id: str = "SYSTEM",
        user_role: str = "SYSTEM"
    ) -> Case:
        # Check if case already exists
        existing = db.query(Case).filter(Case.case_id == case_id).first()
        if existing:
            return existing

        case = Case(
            case_id=case_id,
            svi=svi,
            risk_category=risk_category,
            risk_factors=risk_factors,
            human_review_required=human_review_required,
            urgent_safety_indicator=urgent_safety_indicator,
            status="NEW",
            state=state,
            district=district,
            language=language,
            input_type=input_type,
            assessment_mode=assessment_mode,
            narrative_summary=narrative_summary,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        db.add(case)
        db.commit()
        db.refresh(case)

        # Generate initial support actions based on recommendations
        recs = SupportRecommendationService.generate_recommendations(
            svi=svi,
            risk_category=risk_category,
            risk_factors=risk_factors,
            human_review_required=human_review_required,
            urgent_safety_indicator=urgent_safety_indicator
        )

        for rec in recs:
            action = SupportAction(
                case_id=case_id,
                action_type=rec["type"],
                priority=rec["priority"],
                status="PENDING",
                notes=rec["suggested_action"],
                created_by="RECOMMENDATION_ENGINE"
            )
            db.add(action)

        # Initial status history
        history = CaseStatusHistory(
            case_id=case_id,
            old_status="NONE",
            new_status="NEW",
            changed_by=user_id,
            reason="Initial case creation from assessment",
            timestamp=datetime.utcnow()
        )
        db.add(history)

        db.commit()

        AuditService.log_action(
            db=db,
            user_id=user_id,
            role=user_role,
            action="CASE_CREATED",
            case_id=case_id,
            metadata={
                "svi": svi,
                "risk_category": risk_category,
                "human_review_required": human_review_required,
                "urgent_safety_indicator": urgent_safety_indicator
            }
        )

        return case

    @staticmethod
    def get_case(db: Session, case_id: str, user_id: str = "OFFICER-001", user_role: str = "SUPERVISOR") -> Optional[Dict[str, Any]]:
        case = db.query(Case).filter(Case.case_id == case_id).first()
        if not case:
            return None

        # Log case view
        AuditService.log_action(
            db=db,
            user_id=user_id,
            role=user_role,
            action="CASE_VIEWED",
            case_id=case_id
        )

        recommendations = SupportRecommendationService.generate_recommendations(
            svi=case.svi,
            risk_category=case.risk_category,
            risk_factors=case.risk_factors,
            human_review_required=case.human_review_required,
            urgent_safety_indicator=case.urgent_safety_indicator
        )

        return {
            "case_id": case.case_id,
            "svi": case.svi,
            "risk_category": case.risk_category,
            "risk_factors": case.risk_factors,
            "human_review_required": case.human_review_required,
            "urgent_safety_indicator": case.urgent_safety_indicator,
            "status": case.status,
            "assigned_to": case.assigned_to,
            "state": case.state,
            "district": case.district,
            "language": case.language,
            "input_type": case.input_type,
            "assessment_mode": case.assessment_mode,
            "narrative_summary": case.narrative_summary,
            "created_at": case.created_at,
            "updated_at": case.updated_at,
            "risk_assessment": {
                "case_id": case.case_id,
                "svi": case.svi,
                "risk_category": case.risk_category,
                "risk_factors": case.risk_factors,
                "human_review_required": case.human_review_required,
                "urgent_safety_indicator": case.urgent_safety_indicator,
                "assessment_mode": case.assessment_mode
            },
            "recommendations": recommendations,
            "notes": case.notes,
            "referrals": case.referrals,
            "audit_history": case.status_history,
            "support_actions": case.support_actions
        }

    @staticmethod
    def update_status(
        db: Session,
        case_id: str,
        new_status: str,
        reason: str,
        user_id: str,
        user_role: str
    ) -> Case:
        case = db.query(Case).filter(Case.case_id == case_id).first()
        if not case:
            raise ValueError("Case not found")

        old_status = case.status
        if old_status == new_status:
            return case

        case.status = new_status
        case.updated_at = datetime.utcnow()

        history = CaseStatusHistory(
            case_id=case_id,
            old_status=old_status,
            new_status=new_status,
            changed_by=user_id,
            reason=reason,
            timestamp=datetime.utcnow()
        )
        db.add(history)
        db.commit()
        db.refresh(case)

        action_name = "CASE_CLOSED" if new_status in ("RESOLVED", "CLOSED") else "STATUS_CHANGED"

        AuditService.log_action(
            db=db,
            user_id=user_id,
            role=user_role,
            action=action_name,
            case_id=case_id,
            metadata={"old_status": old_status, "new_status": new_status, "reason": reason}
        )

        return case

    @staticmethod
    def assign_case(
        db: Session,
        case_id: str,
        assigned_to: str,
        user_id: str,
        user_role: str
    ) -> Case:
        case = db.query(Case).filter(Case.case_id == case_id).first()
        if not case:
            raise ValueError("Case not found")

        case.assigned_to = assigned_to
        if case.status == "NEW":
            case.status = "ASSIGNED"
            history = CaseStatusHistory(
                case_id=case_id,
                old_status="NEW",
                new_status="ASSIGNED",
                changed_by=user_id,
                reason=f"Assigned to officer {assigned_to}",
                timestamp=datetime.utcnow()
            )
            db.add(history)

        case.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(case)

        AuditService.log_action(
            db=db,
            user_id=user_id,
            role=user_role,
            action="CASE_ASSIGNED",
            case_id=case_id,
            metadata={"assigned_to": assigned_to}
        )

        return case

    @staticmethod
    def add_note(
        db: Session,
        case_id: str,
        note_text: str,
        visibility: str,
        user_id: str,
        user_role: str
    ) -> CaseNote:
        case = db.query(Case).filter(Case.case_id == case_id).first()
        if not case:
            raise ValueError("Case not found")

        note = CaseNote(
            case_id=case_id,
            author_id=user_id,
            note=note_text,
            visibility=visibility,
            created_at=datetime.utcnow()
        )
        db.add(note)
        db.commit()
        db.refresh(note)

        AuditService.log_action(
            db=db,
            user_id=user_id,
            role=user_role,
            action="NOTE_ADDED",
            case_id=case_id,
            metadata={"note_id": note.id, "visibility": visibility}
        )

        return note

    @staticmethod
    def list_cases(
        db: Session,
        search_case_id: Optional[str] = None,
        risk_category: Optional[str] = None,
        status: Optional[str] = None,
        language: Optional[str] = None,
        state: Optional[str] = None,
        district: Optional[str] = None,
        assigned_to: Optional[str] = None,
        human_review_required: Optional[bool] = None,
        urgent_safety_indicator: Optional[bool] = None,
        limit: int = 100,
        offset: int = 0
    ) -> List[Case]:
        query = db.query(Case)

        if search_case_id:
            query = query.filter(Case.case_id.ilike(f"%{search_case_id}%"))
        if risk_category:
            query = query.filter(Case.risk_category == risk_category)
        if status:
            query = query.filter(Case.status == status)
        if language:
            query = query.filter(Case.language == language)
        if state:
            query = query.filter(Case.state == state)
        if district:
            query = query.filter(Case.district == district)
        if assigned_to:
            query = query.filter(Case.assigned_to == assigned_to)
        if human_review_required is not None:
            query = query.filter(Case.human_review_required == human_review_required)
        if urgent_safety_indicator is not None:
            query = query.filter(Case.urgent_safety_indicator == urgent_safety_indicator)

        return query.order_by(Case.created_at.desc()).offset(offset).limit(limit).all()

    @staticmethod
    def get_dashboard_summary(db: Session) -> Dict[str, int]:
        """
        Calculates non-PII aggregate metrics for the Module 3 Authority Dashboard.
        """
        total_cases = db.query(Case).count()
        new_cases = db.query(Case).filter(Case.status == "NEW").count()
        under_review = db.query(Case).filter(Case.status == "UNDER_REVIEW").count()
        follow_up_required = db.query(Case).filter(Case.status == "FOLLOW_UP_REQUIRED").count()
        high_priority = db.query(Case).filter(Case.risk_category.in_(["High", "Critical"])).count()
        human_review_required = db.query(Case).filter(Case.human_review_required == True).count()

        return {
            "total_cases": total_cases,
            "new_cases": new_cases,
            "under_review": under_review,
            "follow_up_required": follow_up_required,
            "high_priority": high_priority,
            "human_review_required": human_review_required
        }
