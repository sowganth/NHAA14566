from fastapi import APIRouter
from config import NON_CLINICAL_DISCLAIMER

router = APIRouter(prefix="/api", tags=["System Health"])

@router.get("/health")
def health_check():
    return {
        "status": "online",
        "service": "NHAA 14566 Module 1 — AI Interaction & Emotion Analysis",
        "version": "1.0.0-hackathon-prototype",
        "supported_languages_count": 11,
        "disclaimer": NON_CLINICAL_DISCLAIMER
    }
