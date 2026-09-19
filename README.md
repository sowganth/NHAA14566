# National Helpline Against Atrocities (NHAA 14566) - Full-Stack Unified System

An integrated AI-assisted Stress Vulnerability Index (SVI) assessment, voice/text emotion analysis, and support recommendation platform built for the National Helpline Against Atrocities (NHAA 14566).

---

## 🌟 Architecture Overview

```text
                                 ┌───────────────────────────┐
                                 │ React + Vite + Tailwind   │
                                 │   Frontend (Port 5173)    │
                                 └─────────────┬─────────────┘
                                               │ HTTP / REST API
                                               ▼
                                 ┌───────────────────────────┐
                                 │  FastAPI Unified Backend  │
                                 │       (Port 8000)         │
                                 └─────────────┬─────────────┘
                                               │
             ┌─────────────────────────────────┼─────────────────────────────────┐
             ▼                                 ▼                                 ▼
┌───────────────────────────┐     ┌───────────────────────────┐     ┌───────────────────────────┐
│         MODULE 1          │     │         MODULE 2          │     │         MODULE 3          │
│ Multi-Lingual NLP / Text  │  ─► │ Stress Vulnerability      │  ─► │ Decision Support, Relief  │
│ & Voice Emotion Analyzer  │     │ Index (SVI) & Safety Rule │     │ Actions, Referral Matrix, │
│ (11 Indian Languages)     │     │ Engine (Deterministic)    │     │ & Case Management DB      │
└───────────────────────────┘     └───────────────────────────┘     └───────────────────────────┘
                                               │
                                               ▼
                                 ┌───────────────────────────┐
                                 │  Unified SQLite Database  │
                                 │     (data/app.db)         │
                                 └───────────────────────────┘
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ and `npm`

### 2. Backend Setup
```bash
# From project root
python -m pip install -r backend/requirements.txt

# Run FastAPI backend server
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
The FastAPI backend will run at: `http://localhost:8000`  
API Swagger Documentation: `http://localhost:8000/docs`

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (if not already installed)
npm install

# Run Vite dev server
npm run dev
```
The React frontend will run at: `http://localhost:5173`

---

## 🔗 End-to-End Pipeline Workflow

1. **Intake / New Assessment**: Intake operator submits survivor text complaint or records voice input on `/new-assessment`.
2. **Module 1 Execution**: 
   - Language is auto-detected across 11 regional Indian languages (Hindi, Tamil, Telugu, Marathi, Bengali, Gujarati, Kannada, Malayalam, Punjabi, Odia, English).
   - Sentiment, distress score, extracted keywords, threat level, and voice pitch/shimmer/tone metrics are processed.
3. **Module 2 Execution**:
   - SVI Risk Score calculated via deterministic weights:
     - Physical Violence (0.35), Economic Distress (0.25), Social Isolation (0.20), Institutional Obstacles (0.20).
   - Critical Safety Overrides evaluated (e.g., immediate threat to life, severe physical harm, active displacement).
   - Explainable breakdown generated showing score drivers and risk categorization.
4. **Module 3 Execution**:
   - Immediate protection actions, legal aid pathways, and compensation eligibility computed.
   - Recommended agency referrals dispatched to nearest District Legal Services Authority (DLSA), Special Police Cell, or One Stop Centre (OSC).
   - Case stored in SQLite database (`data/app.db`) with unified `case_id` (e.g., `DEMO-14566-001`).

---

## 📊 Database Schema (`data/app.db`)

- **`cases`**: Unified case registry with status lifecycle (`new`, `under_review`, `action_recommended`, `referred`, `closed`).
- **`interaction_analysis`**: Module 1 NLP text & voice metrics, detected emotions, confidence scores.
- **`assessments`**: Module 2 SVI score, severity classification, safety override status, explanation breakdown.
- **`support_actions`**: Module 3 emergency, legal, medical, and financial intervention recommendations.
- **`referrals`**: Target agency assignments with SLA tracking and priority.
- **`case_notes`**: Operator notes and evaluative remarks.
- **`case_status_history`**: Complete audit trail of case status transitions.
- **`audit_logs`**: RBAC user activity log.

---

## 🛡️ Safety & Data Ethics Disclaimers

> [!IMPORTANT]
> **Human-in-the-Loop Requirement**: All AI-computed SVI scores and recommended actions are strictly intended for decision-support purposes. Trained human intake officers and evaluators retain final authority over all interventions.

---

## 🧹 Legacy Subfolder Cleanup Notice

The original standalone subfolders (`module1/`, `module2/`, `module3/`) have been fully refactored and merged into the unified `backend/`, `frontend/`, and `data/` structures. 

After verifying operational stability, the legacy folders may be safely deleted or archived:
```bash
# Optional cleanup command
rm -rf module1 module2 module3
```
