from contextlib import asynccontextmanager
import json
import os

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.database.connection import engine, Base
from backend.api.health import router as health_router
from backend.api.module1 import router as module1_router
from backend.api.module2 import router as module2_router
from backend.api.module3 import router as module3_router
from backend.api.assessment import router as assessment_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure all tables exist in app.db upon launch
    Base.metadata.create_all(bind=engine)
    print("NHAA 14566 Unified Database initialized successfully.")
    yield


app = FastAPI(
    title="NHAA 14566 — AI-Enabled Stress & Trauma Assessment System",
    description=(
        "Unified Full-Stack FastAPI Backend for National Helpline Against Atrocities (NHAA 14566).\n"
        "Integrates Module 1 (Interaction Analysis), Module 2 (SVI Assessment Engine), "
        "and Module 3 (Support Recommendations & Case Management System)."
    ),
    version="1.0.0",
    docs_url="/docs",
    openapi_url="/openapi.json",
    lifespan=lifespan
)

def get_cors_origins():
    configured_origins = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173,http://127.0.0.1:4173"
    )
    try:
        origins = json.loads(configured_origins)
        if isinstance(origins, list):
            return [origin.strip() for origin in origins if origin.strip() and origin.strip() != "*"]
    except json.JSONDecodeError:
        pass
    return [origin.strip() for origin in configured_origins.split(",") if origin.strip() and origin.strip() != "*"]


app.add_middleware(
    CORSMiddleware,
    allow_origins=get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"[SERVER ERROR] {request.method} {request.url.path}: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected server error occurred. Please retry or contact administrator."}
    )

# Include Routers
app.include_router(health_router)
app.include_router(module1_router)
app.include_router(module2_router)
app.include_router(module3_router)
app.include_router(assessment_router)


@app.get("/")
def root():
    return {
        "service": "NHAA 14566 Unified Full-Stack Backend",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/api/health",
        "status": "online"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
