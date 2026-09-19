from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any


class TextAnalysisRequest(BaseModel):
    text: str = Field(..., description="Victim narrative text or complaint transcript")
    language: str = Field(default="English", description="Target language (e.g., Tamil, Hindi, English)")
    case_id: Optional[str] = Field(default=None, description="Optional common case ID (e.g., DEMO-14566-001)")
    consent: bool = Field(default=True, description="User consent flag")


class ExplainabilityItem(BaseModel):
    indicator: str
    category: str
    confidence: float
    matched_term: str
    rationale: str


class EmotionScores(BaseModel):
    fear: float
    anxiety: float
    sadness: float
    anger: float
    distress: float


class TextAnalysisResponse(BaseModel):
    record_id: Optional[int] = None
    case_id: str
    language: str
    analysis_type: str = "Text"
    emotion_scores: EmotionScores
    indicators: List[str]
    trauma_indicators: List[str]
    vulnerability_indicators: List[str]
    urgent_safety_indicators: List[str]
    urgent_review: bool
    confidence: float
    explainability: List[ExplainabilityItem]
    disclaimer: Optional[str] = None


class SpeechFeatures(BaseModel):
    speech_rate: int
    pause_frequency: int
    pitch_variation: int
    intensity: int
    hesitation: int


class VoiceAnalysisResponse(BaseModel):
    record_id: Optional[int] = None
    case_id: str
    language: str
    analysis_type: str = "Voice"
    transcript: str
    speech_features: SpeechFeatures
    emotion_scores: EmotionScores
    indicators: List[str]
    trauma_indicators: List[str]
    vulnerability_indicators: List[str]
    urgent_safety_indicators: List[str]
    urgent_review: bool
    confidence: float
    explainability: List[ExplainabilityItem]
    demo_notice: Optional[str] = None
    disclaimer: Optional[str] = None
