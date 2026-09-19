from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api import api_router
from app.core.config import settings
from app.core.logging import logger
from app.models.database import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: initialize database tables
    logger.info("Initializing SVI Assessment Engine database...")
    init_db()
    logger.info("SVI Assessment Engine initialized successfully.")
    yield
    # Shutdown
    logger.info("Shutting down SVI Assessment Engine...")


app = FastAPI(
    title="NHAA 14566 - Stress Vulnerability Assessment Engine (SVI Engine)",
    description=(
        "Module 2 of the AI-enabled Real-Time Stress and Trauma Assessment System for the "
        "National Helpline Against Atrocities (NHAA 14566).\n\n"
        "**Ethical Notice**: This service is a decision-support system to assist trained human caseworkers, "
        "NOT a clinical diagnostic system. It does not diagnose PTSD, depression, or medical conditions, "
        "nor does it make independent legal or police intervention decisions."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# CORS middleware for Team 3 Dashboard integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router)


@app.get("/", include_in_schema=False)
def root():
    return {
        "service": "NHAA 14566 Stress Vulnerability Assessment Engine (Module 2)",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health",
        "notice": "Decision-support system. Not for clinical diagnosis.",
    }
