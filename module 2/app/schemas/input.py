from typing import Any, Dict, List, Optional, Union
from pydantic import BaseModel, Field, field_validator, model_validator


class PsychologicalFeatures(BaseModel):
    stress: Optional[float] = Field(None, ge=0.0, le=100.0, description="Stress indicator score 0-100")
    trauma: Optional[float] = Field(None, ge=0.0, le=100.0, description="Trauma indicator score 0-100")
    fear: Optional[float] = Field(None, ge=0.0, le=100.0, description="Fear indicator score 0-100")
    anxiety: Optional[float] = Field(None, ge=0.0, le=100.0, description="Anxiety indicator score 0-100")
    sadness: Optional[float] = Field(None, ge=0.0, le=100.0, description="Sadness indicator score 0-100")
    anger: Optional[float] = Field(None, ge=0.0, le=100.0, description="Anger indicator score 0-100")
    social_isolation: Optional[float] = Field(None, ge=0.0, le=100.0, description="Social isolation score 0-100")
    intimidation: Optional[float] = Field(None, ge=0.0, le=100.0, description="Intimidation indicator score 0-100")
    threat: Optional[float] = Field(None, ge=0.0, le=100.0, description="Perceived threat score 0-100")
    helplessness: Optional[float] = Field(None, ge=0.0, le=100.0, description="Helplessness indicator score 0-100")
    speech_distress: Optional[float] = Field(None, ge=0.0, le=100.0, description="Acoustic speech distress score 0-100")
    speech_hesitation: Optional[float] = Field(None, ge=0.0, le=100.0, description="Speech hesitation score 0-100")
    speech_instability: Optional[float] = Field(None, ge=0.0, le=100.0, description="Speech instability/tremor score 0-100")
    suicidal_ideation: Optional[float] = Field(None, ge=0.0, le=100.0, description="Explicit suicidal ideation score 0-100")
    self_harm_indicator: Optional[float] = Field(None, ge=0.0, le=100.0, description="Explicit self-harm score 0-100")
    immediate_danger: Optional[Union[bool, float]] = Field(
        None, description="Immediate danger flag (bool or numeric 0-100/0-1)"
    )

    @field_validator("immediate_danger", mode="before")
    @classmethod
    def validate_immediate_danger(cls, v: Any) -> Optional[float]:
        if v is None:
            return None
        if isinstance(v, bool):
            return 100.0 if v else 0.0
        try:
            num = float(v)
            if num < 0.0 or num > 100.0:
                raise ValueError("immediate_danger must be between 0 and 100 or a boolean")
            # If 1 is sent as integer/float, treat 1.0 as active flag if <= 1.0
            return num
        except (TypeError, ValueError) as e:
            raise ValueError(f"Invalid immediate_danger value: {v}") from e


class ContextFactors(BaseModel):
    violence_reported: Optional[bool] = Field(False, description="Physical violence reported")
    sexual_violence_reported: Optional[bool] = Field(False, description="Sexual violence reported")
    murder_of_family_member: Optional[bool] = Field(False, description="Homicide of family member")
    displacement: Optional[bool] = Field(False, description="Displacement/eviction from residence")
    social_boycott: Optional[bool] = Field(False, description="Community/social boycott imposed")
    ongoing_threat: Optional[bool] = Field(False, description="Perpetrator active ongoing threats")
    legal_delay: Optional[bool] = Field(False, description="Denial or delay of FIR/legal protection")


class AssessmentInput(BaseModel):
    case_id: str = Field(..., min_length=1, max_length=64, description="Anonymized unique case identifier")
    language: Optional[str] = Field("en", max_length=10, description="Language code (e.g. ta, hi, en)")
    features: PsychologicalFeatures = Field(..., description="Psychological and acoustic indicators")
    context: Optional[ContextFactors] = Field(default_factory=ContextFactors, description="Contextual incident factors")

    model_config = {
        "extra": "forbid",
        "json_schema_extra": {
            "example": {
                "case_id": "NHAA-2026-000123",
                "language": "ta",
                "features": {
                    "stress": 72,
                    "trauma": 68,
                    "fear": 81,
                    "anxiety": 75,
                    "sadness": 60,
                    "anger": 35,
                    "social_isolation": 70,
                    "intimidation": 85,
                    "threat": 80,
                    "helplessness": 76,
                    "speech_distress": 72,
                    "speech_hesitation": 65,
                    "speech_instability": 70,
                    "suicidal_ideation": 0,
                    "self_harm_indicator": 0,
                    "immediate_danger": 1
                },
                "context": {
                    "violence_reported": True,
                    "sexual_violence_reported": False,
                    "murder_of_family_member": False,
                    "displacement": True,
                    "social_boycott": True,
                    "ongoing_threat": True,
                    "legal_delay": True
                }
            }
        }
    }


class BatchAssessmentInput(BaseModel):
    cases: List[AssessmentInput] = Field(..., min_length=1, max_length=100, description="List of case assessments")
