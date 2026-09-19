from datetime import datetime
from typing import List, Optional
from sqlalchemy.orm import Session
from backend.database.models import Referral
from backend.services.audit_service import AuditService


class ReferralService:
    @staticmethod
    def create_referral(
        db: Session,
        case_id: str,
        referral_type: str,
        destination: str,
        notes: Optional[str],
        user_id: str = "OFFICER-001",
        role: str = "CASE_OFFICER"
    ) -> Referral:
        referral = Referral(
            case_id=case_id,
            referral_type=referral_type,
            destination=destination,
            status="INITIATED",
            notes=notes,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        db.add(referral)
        db.commit()
        db.refresh(referral)

        AuditService.log_action(
            db=db,
            user_id=user_id,
            role=role,
            action="REFERRAL_CREATED",
            case_id=case_id,
            metadata={
                "referral_id": referral.id,
                "referral_type": referral_type,
                "destination": destination
            }
        )
        return referral

    @staticmethod
    def get_referrals_by_case(db: Session, case_id: str) -> List[Referral]:
        return db.query(Referral).filter(Referral.case_id == case_id).order_by(Referral.created_at.desc()).all()

    @staticmethod
    def get_all_referrals(db: Session, limit: int = 100) -> List[Referral]:
        return db.query(Referral).order_by(Referral.created_at.desc()).limit(limit).all()

    @staticmethod
    def update_referral_status(
        db: Session,
        referral_id: int,
        status: str,
        notes: Optional[str] = None,
        user_id: str = "OFFICER-001",
        role: str = "CASE_OFFICER"
    ) -> Referral:
        referral = db.query(Referral).filter(Referral.id == referral_id).first()
        if not referral:
            raise ValueError("Referral not found")

        referral.status = status
        if notes:
            referral.notes = f"{referral.notes}\n[Update]: {notes}" if referral.notes else notes
        referral.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(referral)

        AuditService.log_action(
            db=db,
            user_id=user_id,
            role=role,
            action="REFERRAL_UPDATED",
            case_id=referral.case_id,
            metadata={"referral_id": referral_id, "new_status": status}
        )
        return referral
