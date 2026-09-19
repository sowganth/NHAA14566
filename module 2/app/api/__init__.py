from fastapi import APIRouter
from app.api.assessment import router as assessment_router
from app.api.health import router as health_router

api_router = APIRouter()
api_router.include_router(health_router)
api_router.include_router(assessment_router)
