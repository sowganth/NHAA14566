from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class FullPipelineRequest(BaseModel):
    state: str = Field("Tamil Nadu", json_schema_extra={"example": "Tamil Nadu"})
    district: str = Field("Chennai", json_schema_extra={"example": "Chennai"})
    language: str = Field("Tamil", json_schema_extra={"example": "Tamil"})
    input_type: str = Field("text", json_schema_extra={"example": "text"})
    narrative: str = Field(..., min_length=5, json_schema_extra={"example": "Complaining about ongoing threat and fear in locality"})
    case_id: Optional[str] = None


class FullPipelineResponse(BaseModel):
    case_id: str
    module1: Dict[str, Any]
    module2: Dict[str, Any]
    module3: Dict[str, Any]
