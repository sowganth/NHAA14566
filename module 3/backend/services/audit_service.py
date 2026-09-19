from datetime import datetime
from typing import Optional, Dict, Any, List
from sqlalchemy.orm import Session
from backend.database.models import AuditLog


class AuditService:
    @staticmethod
    def log_action(
        db: Session,
        user_id: str,
        role: str,
        action: str,
        case_id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> AuditLog:
        """
        Creates an audit record for system actions.
        Ensures sensitive personal content is stripped from metadata.
        """
        # Sanitize metadata to avoid logging sensitive PII narrative
        safe_meta = {}
        if metadata:
            for k, v in metadata.items():
                if k not in ("narrative", "personal_info", "aadhaar", "phone"):
                    safe_meta[k] = v

        audit_entry = AuditLog(
            user_id=user_id,
            role=role,
            case_id=case_id,
            action=action,
            timestamp=datetime.utcnow(),
            metadata_json=safe_meta
        )
        db.add(audit_entry)
        db.commit()
        db.refresh(audit_entry)
        return audit_entry

    @staticmethod
    def get_audit_logs(
        db: Session,
        case_id: Optional[str] = None,
        limit: int = 100,
        offset: int = 0
    ) -> List[AuditLog]:
        query = db.query(AuditLog)
        if case_id:
            query = query.filter(AuditLog.case_id == case_id)
        return query.order_by(AuditLog.timestamp.desc()).offset(offset).limit(limit).all()
