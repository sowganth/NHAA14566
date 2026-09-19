from fastapi import APIRouter
from datetime import datetime

router = APIRouter(tags=["Health"])


@router.get("/api/health")
@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "NHAA 14566 Unified Full-Stack Backend",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat()
    }
