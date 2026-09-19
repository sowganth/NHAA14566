import json
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from backend.database.connection import Base


class Case(Base):
    __tablename__ = "cases"

    case_id = Column(String, primary_key=True, index=True)
    svi = Column(Integer, nullable=False, default=0)
    risk_category = Column(String, nullable=False, default="Low")
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
    interaction_records = relationship("InteractionAnalysisRecord", back_populates="case", cascade="all, delete-orphan")
    assessment_records = relationship("AssessmentRecord", back_populates="case", cascade="all, delete-orphan")
    support_actions = relationship("SupportAction", back_populates="case", cascade="all, delete-orphan")
    status_history = relationship("CaseStatusHistory", back_populates="case", cascade="all, delete-orphan")
    notes = relationship("CaseNote", back_populates="case", cascade="all, delete-orphan")
    referrals = relationship("Referral", back_populates="case", cascade="all, delete-orphan")


class InteractionAnalysisRecord(Base):
    __tablename__ = "interaction_analysis"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    case_id = Column(String, ForeignKey("cases.case_id"), nullable=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    language = Column(String(50), default="English")
    analysis_type = Column(String(20), default="Text")  # "Text" or "Voice"
    narrative_excerpt = Column(Text, nullable=True)

    emotion_scores_json = Column(Text, nullable=False)
    indicators_json = Column(Text, nullable=False)
    trauma_indicators_json = Column(Text, nullable=False)
    vulnerability_indicators_json = Column(Text, nullable=False)
    urgent_safety_indicators_json = Column(Text, nullable=False)
    explainability_json = Column(Text, nullable=False)
    speech_features_json = Column(Text, nullable=True)

    urgent_review = Column(Boolean, default=False)
    confidence = Column(Float, default=85.0)
    transcript = Column(Text, nullable=True)
    consent = Column(Boolean, default=True)

    case = relationship("Case", back_populates="interaction_records")

    def to_dict(self):
        return {
            "id": self.id,
            "case_id": self.case_id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "language": self.language,
            "analysis_type": self.analysis_type,
            "narrative_excerpt": self.narrative_excerpt,
            "emotion_scores": json.loads(self.emotion_scores_json) if self.emotion_scores_json else {},
            "indicators": json.loads(self.indicators_json) if self.indicators_json else [],
            "trauma_indicators": json.loads(self.trauma_indicators_json) if self.trauma_indicators_json else [],
            "vulnerability_indicators": json.loads(self.vulnerability_indicators_json) if self.vulnerability_indicators_json else [],
            "urgent_safety_indicators": json.loads(self.urgent_safety_indicators_json) if self.urgent_safety_indicators_json else [],
            "explainability": json.loads(self.explainability_json) if self.explainability_json else [],
            "speech_features": json.loads(self.speech_features_json) if self.speech_features_json else None,
            "urgent_review": self.urgent_review,
            "confidence": self.confidence,
            "transcript": self.transcript,
            "consent": self.consent
        }


class AssessmentRecord(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(String(64), ForeignKey("cases.case_id"), index=True, nullable=False)
    svi_score = Column(Float, nullable=False)
    risk_category = Column(String(32), nullable=False)
    confidence = Column(Float, nullable=False)
    human_review_required = Column(Boolean, default=False, nullable=False)
    priority = Column(String(64), nullable=False)
    model_version = Column(String(32), nullable=False)
    language = Column(String(16), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    case = relationship("Case", back_populates="assessment_records")
    indicators = relationship("RiskIndicatorRecord", back_populates="assessment", cascade="all, delete-orphan")
    flags = relationship("AssessmentFlagRecord", back_populates="assessment", cascade="all, delete-orphan")


class RiskIndicatorRecord(Base):
    __tablename__ = "risk_indicators"

    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id", ondelete="CASCADE"), nullable=False)
    indicator_name = Column(String(64), nullable=False)
    raw_score = Column(Float, nullable=True)
    severity = Column(String(32), nullable=False)
    weighted_contribution = Column(Float, nullable=False)

    assessment = relationship("AssessmentRecord", back_populates="indicators")


class AssessmentFlagRecord(Base):
    __tablename__ = "assessment_flags"

    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id", ondelete="CASCADE"), nullable=False)
    flag_type = Column(String(64), nullable=False)
    severity = Column(String(32), nullable=False)
    trigger_reason = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    assessment = relationship("AssessmentRecord", back_populates="flags")


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
