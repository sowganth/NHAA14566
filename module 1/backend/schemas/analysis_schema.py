from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any

class TextAnalysisRequest(BaseModel):
    text: str = Field(..., description="Victim/complainant narrative text")
    language: str = Field(default="English", description="Target narrative language")
    case_id: Optional[str] = Field(default=None, description="Optional case or reference ID")
    consent: bool = Field(default=True, description="Consent for processing")

class EmotionScores(BaseModel):
    fear: int = Field(..., ge=0, le=100)
    anxiety: int = Field(..., ge=0, le=100)
    sadness: int = Field(..., ge=0, le=100)
    anger: int = Field(..., ge=0, le=100)
    distress: int = Field(..., ge=0, le=100)

class SpeechFeatures(BaseModel):
    speech_rate: int = Field(..., description="Words per minute (wpm)")
    pause_frequency: int = Field(..., description="Pauses per 10 seconds")
    pitch_variation: int = Field(..., description="Pitch variation index (Hz)")
    intensity: int = Field(..., description="Audio intensity level (dB)")
    hesitation: int = Field(..., description="Hesitation score (0-100)")

class ExplainabilityItem(BaseModel):
    indicator: str
    category: str
    confidence: int
    matched_term: Optional[str] = None
    rationale: str

class TextAnalysisResponse(BaseModel):
    case_id: Optional[str] = None
    language: str
    analysis_type: str = "Text"
    emotion_scores: EmotionScores
    indicators: List[str]
    trauma_indicators: List[str]
    vulnerability_indicators: List[str]
    urgent_safety_indicators: List[str] = []
    urgent_review: bool
    confidence: int
    explainability: List[ExplainabilityItem]
    disclaimer: str
    record_id: Optional[int] = None

class VoiceAnalysisResponse(BaseModel):
    case_id: Optional[str] = None
    language: str
    analysis_type: str = "Voice"
    transcript: str
    speech_features: SpeechFeatures
    emotion_scores: EmotionScores
    indicators: List[str]
    trauma_indicators: List[str]
    vulnerability_indicators: List[str]
    urgent_safety_indicators: List[str] = []
    urgent_review: bool
    confidence: int
    explainability: List[ExplainabilityItem]
    demo_notice: str = "DEMO ANALYSIS — Replace with validated speech/emotion model."
    disclaimer: str
    record_id: Optional[int] = None

class AssessmentRecordSchema(BaseModel):
    id: int
    case_id: str
    created_at: str
    language: str
    analysis_type: str
    narrative_excerpt: Optional[str]
    emotion_scores: Dict[str, int]
    indicators: List[str]
    trauma_indicators: List[str]
    vulnerability_indicators: List[str]
    urgent_safety_indicators: List[str]
    explainability: List[Dict[str, Any]]
    speech_features: Optional[Dict[str, Any]]
    urgent_review: bool
    confidence: float
    transcript: Optional[str]
    consent: bool
