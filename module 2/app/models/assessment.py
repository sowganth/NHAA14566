from datetime import datetime, timezone
from sqlalchemy import Column, Integer, Float, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.models.database import Base


class AssessmentRecord(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(String(64), index=True, nullable=False)
    svi_score = Column(Float, nullable=False)
    risk_category = Column(String(32), nullable=False)
    confidence = Column(Float, nullable=False)
    human_review_required = Column(Boolean, default=False, nullable=False)
    priority = Column(String(64), nullable=False)
    model_version = Column(String(32), nullable=False)
    language = Column(String(16), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

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
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    assessment = relationship("AssessmentRecord", back_populates="flags")
