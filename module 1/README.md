# NHAA 14566 — AI Interaction & Emotion Analysis Module 1

**AI-Based Real-Time Stress and Trauma Assessment Module for Victims/Complainants**

> [!IMPORTANT]
> **AI Decision-Support Prototype Notice**: This system is designed as an **AI decision-support intake prototype**, NOT a clinical medical diagnosis system. It does NOT claim to clinically diagnose depression, PTSD, or any mental health condition. All high-risk safety indicators trigger mandatory **"Urgent Human Review Required"** for professional escalation. Zero Aadhaar numbers or unnecessary PII are collected.

---

## Technical Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Recharts (Radar & Bar charts), Lucide React Icons
- **Backend**: Python 3.14+, FastAPI, Uvicorn, SQLAlchemy, SQLite (Audit log database)
- **API Protocol**: REST JSON APIs with multipart audio support
- **Supported Languages**: 11 Indian Languages (English, Tamil, Hindi, Telugu, Kannada, Malayalam, Marathi, Bengali, Gujarati, Punjabi, Urdu)

---

## Key Features

1. **Government / Public-Service Dashboard (`NHAA 14566`)**:
   - Official national victim assistance header and privacy indicator
   - Quick action cards for New Assessment, Text Analysis, Voice Analysis, and Audit Log History
   - Prominent confidentiality disclaimer banner

2. **Multilingual Text Narrative Analysis (`POST /api/analyze-text`)**:
   - Rule/keyword-based NLP engine analyzing fear, anxiety, sadness, anger, and distress (0–100%)
   - Identifies trauma indicators (repeated events, threat/intimidation, social isolation, retaliation fear, family safety)
   - Evaluates urgent safety risks (immediate danger, weapons, self-harm ideation)
   - Triggers **URGENT HUMAN REVIEW REQUIRED** alert when risk thresholds are exceeded

3. **Acoustic Voice Prosody & Speech Analysis (`POST /api/analyze-voice`)**:
   - WebAudio live microphone recorder with animated waveform visualizer & fallback demo simulator
   - Extracts speech rate (WPM), pause frequency, pitch variation (Hz), intensity (dB), and hesitation index (%)
   - Speech-to-text transcript distress evaluation
   - Transparently labeled with `DEMO ANALYSIS — Replace with validated speech/emotion model.`

4. **Explainability & Model Transparency ("Why was this detected?")**:
   - Provides clear evidence categories, matched keywords/snippets, confidence scores, and rationale
   - Explicit probabilistic disclaimer informing counselors that AI indicators are supportive baseline metrics

5. **One-Click Hackathon Demo Mode**:
   - Includes fictional demonstration narratives in Tamil, English, and Hindi (Case ID: `DEMO-14566-001`)
   - Pre-populates narrative and runs immediate analysis for live hackathon presentations

---

## Setup & Run Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 1. Install Backend Dependencies
```bash
pip install -r backend/requirements.txt
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Running the Application

#### Option A: Single Command Launcher (Windows)
Double click `start_app.bat` or run in terminal:
```cmd
.\start_app.bat
```

#### Option B: Manual Execution
- **Backend**:
  ```bash
  python run_backend.py
  ```
  Backend will run at: `http://127.0.0.1:8000` (Swagger UI docs at `http://127.0.0.1:8000/docs`)

- **Frontend**:
  ```bash
  npm run dev
  ```
  Frontend will run at: `http://localhost:3000`

---

## Sample API Requests & Responses

### 1. Text Analysis Endpoint

`POST /api/analyze-text`

**Request Body**:
```json
{
  "text": "அவர் என்னை தினமும் மிரட்டுகிறார். நான் காவல் நிலையத்திற்கு புகார் அளிக்கச் சென்றால் என்னை கொன்றுவிடுவதாகப் பயமுறுத்துகிறார். வீட்டை விட்டு வெளியே செல்லவும் பயமாக இருக்கிறது. கத்தியைக் காட்டி அச்சுறுத்தினார்.",
  "language": "Tamil",
  "case_id": "DEMO-14566-001",
  "consent": true
}
```

**Response**:
```json
{
  "case_id": "DEMO-14566-001",
  "language": "Tamil",
  "analysis_type": "Text",
  "emotion_scores": {
    "fear": 85,
    "anxiety": 70,
    "sadness": 55,
    "anger": 40,
    "distress": 88
  },
  "indicators": [
    "Fear-related expression",
    "Anxiety & panic indicator",
    "High overall emotional distress"
  ],
  "trauma_indicators": [
    "Threat / intimidation expression",
    "Fear of retaliation / disclosure intimidation",
    "Repeated traumatic-event references"
  ],
  "vulnerability_indicators": [],
  "urgent_safety_indicators": [
    "Immediate danger / weapon involvement"
  ],
  "urgent_review": true,
  "confidence": 88,
  "explainability": [
    {
      "indicator": "Fear-related language",
      "category": "Emotional Distress Expression",
      "confidence": 85,
      "matched_term": "பயம், கொன்றுவிடுவேன், மிரட்டுகிறார்",
      "rationale": "Explicit fear & terror terms detected in target language (Tamil)."
    }
  ],
  "disclaimer": "This system is an AI decision-support prototype for victim assistance intake. It provides supportive risk indicators and does NOT produce clinical medical diagnoses or make autonomous police/legal decisions. High-risk cases require immediate human review."
}
```

### 2. Voice Analysis Endpoint

`POST /api/analyze-voice`

**Form Data / Multipart Request**:
- `language`: `Tamil`
- `consent`: `true`
- `case_id`: `DEMO-14566-003`
- `transcript`: `அவர் என்னை தினமும் மிரட்டுகிறார்.`

**Response**:
```json
{
  "case_id": "DEMO-14566-003",
  "language": "Tamil",
  "analysis_type": "Voice",
  "transcript": "அவர் என்னை தினமும் மிரட்டுகிறார்.",
  "speech_features": {
    "speech_rate": 107,
    "pause_frequency": 9,
    "pitch_variation": 57,
    "intensity": 78,
    "hesitation": 84
  },
  "emotion_scores": {
    "fear": 80,
    "anxiety": 75,
    "sadness": 50,
    "anger": 35,
    "distress": 82
  },
  "indicators": [
    "Fear-related expression",
    "Speech hesitation & vocal tremor indicator",
    "Frequent speech interruption & vocal pauses"
  ],
  "urgent_review": true,
  "confidence": 86,
  "demo_notice": "DEMO ANALYSIS — Replace with validated speech/emotion model."
}
```

---

## Production Integration Points

In a full production deployment, the transparent rule/keyword NLP engine and acoustic feature mock can be seamlessly swapped with ML microservices:

1. **NLP Emotion Model**: Replace `services/text_analyzer.py` keyword matching with a fine-tuned IndicBERT or XLM-RoBERTa multi-label classification pipeline (`transformers` / PyTorch).
2. **Speech-to-Text**: Integrate OpenAI Whisper / IndicWhisper ASR for automatic multi-dialect transcription.
3. **Speech Emotion Recognition (SER)**: Connect Librosa or praat-parselmouth audio feature extraction pipelines with a wav2vec2 SER acoustic model.

---

## License & Compliance

Developed for institutional victim intake support under National Health & Safety Framework guidelines.
