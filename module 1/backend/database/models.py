import datetime
import json
from sqlalchemy import Column, Integer, String, Text, Boolean, Float, DateTime
from database.db import Base

class AssessmentRecord(Base):
    __tablename__ = "assessment_records"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(String(50), index=True, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    language = Column(String(50), default="English")
    analysis_type = Column(String(20), default="Text") # "Text" or "Voice"
    narrative_excerpt = Column(Text, nullable=True)
    
    # Store JSON stringified payloads
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

    def to_dict(self):
        return {
            "id": self.id,
            "case_id": self.case_id or f"NHAA-AUDIT-{self.id:04d}",
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
