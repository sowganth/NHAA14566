from typing import Any, Dict, List, Optional, Union
from pydantic import BaseModel, Field, field_validator


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
    immediate_danger: Optional[Union[bool, float]] = Field(None, description="Immediate danger flag")

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
    language: Optional[str] = Field("en", max_length=10, description="Language code")
    features: PsychologicalFeatures = Field(..., description="Psychological and acoustic indicators")
    context: Optional[ContextFactors] = Field(default_factory=ContextFactors, description="Contextual incident factors")


class BatchAssessmentInput(BaseModel):
    cases: List[AssessmentInput] = Field(..., min_length=1, max_length=100, description="List of case assessments")


class IndicatorItem(BaseModel):
    name: str = Field(..., description="Name of psychological indicator")
    score: float = Field(..., description="Normalized score 0-100")
    severity: str = Field(..., description="Severity level: low, moderate, high, critical")


class FeatureContribution(BaseModel):
    feature: str = Field(..., description="Feature identifier")
    raw_score: Optional[float] = Field(None, description="Input raw score (0-100)")
    weight: float = Field(..., description="Applied model weight")
    weighted_contribution: float = Field(..., description="Weighted contribution to total SVI")


class AssessmentSummary(BaseModel):
    svi_score: float = Field(..., ge=0.0, le=100.0, description="Overall Stress Vulnerability Index (0-100)")
    risk_category: str = Field(..., description="Categorical risk: LOW, MODERATE, HIGH, CRITICAL")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Assessment confidence score (0.0 - 1.0)")
    human_review_required: bool = Field(..., description="Whether mandatory human caseworker review is required")


class DataQuality(BaseModel):
    completeness: float = Field(..., ge=0.0, le=1.0, description="Feature completeness ratio (0.0 - 1.0)")
    missing_features: List[str] = Field(default_factory=list, description="List of missing feature names")


class ModelMetadata(BaseModel):
    name: str = Field("SVI_RULE_ENGINE", description="Engine identifier")
    version: str = Field("1.0.0", description="Model version")


class AssessmentOutput(BaseModel):
    case_id: str = Field(..., description="Anonymized case identifier")
    assessment: AssessmentSummary = Field(..., description="Core SVI score and classification")
    indicators: List[IndicatorItem] = Field(default_factory=list, description="Ranked psychological indicators")
    risk_flags: List[str] = Field(default_factory=list, description="Active risk and safety flags")
    contributing_factors: List[str] = Field(default_factory=list, description="Human-readable top drivers")
    feature_contributions: List[FeatureContribution] = Field(default_factory=list, description="Detailed weights and weighted contributions")
    recommended_priority: str = Field(..., description="Recommended support priority")
    suggested_support: List[str] = Field(default_factory=list, description="Recommended support interventions")
    data_quality: DataQuality = Field(..., description="Input data completeness")
    model: ModelMetadata = Field(default_factory=ModelMetadata, description="Scoring model metadata")
    disclaimer: str = Field(
        "AI-generated vulnerability assessment. Requires authorized human review and must not be treated as a clinical diagnosis.",
        description="Mandatory ethical & legal disclaimer",
    )
    created_at: str = Field(..., description="Assessment creation timestamp (UTC ISO 8601)")


class BatchAssessmentOutput(BaseModel):
    total_processed: int = Field(..., description="Total cases evaluated")
    results: List[AssessmentOutput] = Field(..., description="Assessment results for submitted cases")


class ConfigResponse(BaseModel):
    model: ModelMetadata
    weights: Dict[str, float]
    context_weights: Dict[str, float]
    risk_levels: Dict[str, Any]
    safety_rule_keys: List[str]
