from datetime import datetime
from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from backend.database.connection import Base


class Case(Base):
    __tablename__ = "cases"

    case_id = Column(String, primary_key=True, index=True)
    svi = Column(Integer, nullable=False)
    risk_category = Column(String, nullable=False)
    risk_factors = Column(JSON, nullable=False, default=list)
    human_review_required = Column(Boolean, default=True)
    urgent_safety_indicator = Column(Boolean, default=False)
    status = Column(String, nullable=False, default="NEW")
    assigned_to = Column(String, nullable=True)
    state = Column(String, nullable=False, default="Tamil Nadu")
    district = Column(String, nullable=False, default="Chennai")
    language = Column(String, nullable=False, default="Tamil")
    input_type = Column(String, nullable=False, default="text")
    assessment_mode = Column(String, nullable=False, default="demo")
    narrative_summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    support_actions = relationship("SupportAction", back_populates="case", cascade="all, delete-orphan")
    status_history = relationship("CaseStatusHistory", back_populates="case", cascade="all, delete-orphan")
    notes = relationship("CaseNote", back_populates="case", cascade="all, delete-orphan")
    referrals = relationship("Referral", back_populates="case", cascade="all, delete-orphan")


class SupportAction(Base):
    __tablename__ = "support_actions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    case_id = Column(String, ForeignKey("cases.case_id"), nullable=False, index=True)
    action_type = Column(String, nullable=False)
    priority = Column(String, nullable=False, default="HIGH")
    status = Column(String, nullable=False, default="PENDING")
    assigned_to = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    due_at = Column(DateTime, nullable=True)
    notes = Column(Text, nullable=True)
    created_by = Column(String, default="SYSTEM")
    completed_at = Column(DateTime, nullable=True)

    case = relationship("Case", back_populates="support_actions")


class CaseStatusHistory(Base):
    __tablename__ = "case_status_history"

    id = Column(Integer, primary_key=True, autoincrement=True)
    case_id = Column(String, ForeignKey("cases.case_id"), nullable=False, index=True)
    old_status = Column(String, nullable=False)
    new_status = Column(String, nullable=False)
    changed_by = Column(String, nullable=False)
    reason = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    case = relationship("Case", back_populates="status_history")


class CaseNote(Base):
    __tablename__ = "case_notes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    case_id = Column(String, ForeignKey("cases.case_id"), nullable=False, index=True)
    author_id = Column(String, nullable=False)
    note = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    visibility = Column(String, default="AUTHORIZED_STAFF")

    case = relationship("Case", back_populates="notes")


class Referral(Base):
    __tablename__ = "referrals"

    id = Column(Integer, primary_key=True, autoincrement=True)
    case_id = Column(String, ForeignKey("cases.case_id"), nullable=False, index=True)
    referral_type = Column(String, nullable=False)
    destination = Column(String, nullable=False)
    status = Column(String, nullable=False, default="INITIATED")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    notes = Column(Text, nullable=True)

    case = relationship("Case", back_populates="referrals")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String, nullable=False)
    role = Column(String, nullable=False)
    case_id = Column(String, nullable=True, index=True)
    action = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    metadata_json = Column(JSON, nullable=True)
