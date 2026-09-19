from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


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
    feature_contributions: List[FeatureContribution] = Field(
        default_factory=list, description="Detailed weights and weighted contributions for explainability"
    )
    recommended_priority: str = Field(..., description="Recommended support priority for Module 3")
    suggested_support: List[str] = Field(default_factory=list, description="Recommended support interventions")
    data_quality: DataQuality = Field(..., description="Input data completeness and missing attributes")
    model: ModelMetadata = Field(default_factory=ModelMetadata, description="Scoring model metadata")
    disclaimer: str = Field(
        "AI-generated vulnerability assessment. Requires authorized human review and must not be treated as a clinical diagnosis.",
        description="Mandatory ethical & legal disclaimer",
    )
    created_at: str = Field(..., description="Assessment creation timestamp (UTC ISO 8601)")


class BatchAssessmentOutput(BaseModel):
    total_processed: int = Field(..., description="Total cases evaluated")
    results: List[AssessmentOutput] = Field(..., description="Assessment results for submitted cases")


class HealthResponse(BaseModel):
    status: str = Field("healthy", description="Service status")
    database: str = Field(..., description="Database connection status")
    model_version: str = Field(..., description="Loaded scoring engine version")
    timestamp: str = Field(..., description="Current UTC timestamp")


class ConfigResponse(BaseModel):
    model: ModelMetadata
    weights: Dict[str, float]
    context_weights: Dict[str, float]
    risk_levels: Dict[str, Any]
    safety_rule_keys: List[str]
