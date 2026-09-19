from typing import List, Optional
from pydantic import BaseModel, Field


class Module1Input(BaseModel):
    state: str = Field("Tamil Nadu", json_schema_extra={"example": "Tamil Nadu"})
    district: str = Field("Chennai", json_schema_extra={"example": "Chennai"})
    language: str = Field("Tamil", json_schema_extra={"example": "Tamil"})
    input_type: str = Field("text", json_schema_extra={"example": "voice/text"})
    narrative: str = Field(..., min_length=5, json_schema_extra={"example": "Complaining about ongoing threat and fear in locality"})


class Module1Output(BaseModel):
    language: str
    input_type: str
    state: str
    district: str
    detected_indicators: List[str]
    distress_level: str


class Module2Output(BaseModel):
    svi: int = Field(..., ge=0, le=100)
    risk_category: str
    risk_factors: List[str]
    human_review_required: bool
    urgent_safety_indicator: bool
    assessment_mode: str = "demo"


class Module3Output(BaseModel):
    status: str
    recommendations: List[str]
    actions_count: int


class FullPipelineRequest(BaseModel):
    state: str = "Tamil Nadu"
    district: str = "Chennai"
    language: str = "Tamil"
    input_type: str = "text"
    narrative: str
    case_id: Optional[str] = None


class FullPipelineResponse(BaseModel):
    case_id: str
    module1: Module1Output
    module2: Module2Output
    module3: Module3Output
