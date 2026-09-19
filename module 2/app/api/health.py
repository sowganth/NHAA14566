from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.config import scoring_config
from app.models.database import get_db
from app.schemas.output import HealthResponse

router = APIRouter(tags=["Health"])


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Health & Readiness Check",
    description="Returns operational health status, database connectivity, and loaded scoring model version.",
)
def health_check(db: Session = Depends(get_db)) -> HealthResponse:
    db_status = "connected"
    try:
        db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"degraded: {str(e)}"

    model_version = scoring_config.get("model", {}).get("version", "1.0.0")

    return HealthResponse(
        status="healthy" if db_status == "connected" else "degraded",
        database=db_status,
        model_version=model_version,
        timestamp=datetime.now(timezone.utc).isoformat(),
    )
