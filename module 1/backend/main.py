from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.db import engine, Base
from routes import analysis, history, health

# Create DB tables if they don't exist
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="NHAA 14566 - AI Interaction & Emotion Analysis API",
    description="Module 1 — Victim Support Assessment Decision-Support Prototype",
    version="1.0.0"
)

# Enable CORS for local Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(health.router)
app.include_router(analysis.router)
app.include_router(history.router)

@app.get("/")
def root():
    return {
        "message": "NHAA 14566 Module 1 API Service is running.",
        "docs_url": "/docs",
        "health_check": "/api/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
