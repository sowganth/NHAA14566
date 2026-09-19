import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from backend.database.connection import engine, Base
from backend.api.health import router as health_router
from backend.api.module3 import router as module3_router
from backend.api.pipeline import router as pipeline_router
from backend.seed import seed_database


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    try:
        seed_database()
    except Exception as e:
        print(f"Seed info: {e}")
    yield


app = FastAPI(
    title="National Helpline Against Atrocities (NHAA 14566) — Module 3 API",
    description=(
        "Module 3: Decision-Support, Authority Dashboard, Human Review Workflow & Case Management System.\n"
        "Provides support recommendation engine, case tracking, audit history, referrals, and RBAC."
    ),
    version="1.0.0",
    docs_url="/api/docs",
    openapi_url="/api/openapi.json",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"[SERVER ERROR] {request.method} {request.url.path}: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected server error occurred. Please contact system administrator."}
    )

# Include Routers
app.include_router(health_router)
app.include_router(module3_router)
app.include_router(pipeline_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
