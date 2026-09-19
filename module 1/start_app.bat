@echo off
echo ========================================================
echo   NHAA 14566 Module 1 — AI Interaction & Emotion Analysis
echo   Starting Backend (FastAPI) and Frontend (React/Vite)
echo ========================================================

start "Backend FastAPI" cmd /k "python run_backend.py"
start "Frontend Vite" cmd /k "npm run dev"

echo Startup commands initiated.
echo Backend API Docs: http://127.0.0.1:8000/docs
echo Frontend App:    http://localhost:3000
