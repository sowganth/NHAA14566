import json
import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Optional

from database.db import get_db
from database.models import AssessmentRecord
from schemas.analysis_schema import TextAnalysisRequest, TextAnalysisResponse, VoiceAnalysisResponse
from services.text_analyzer import analyze_text_interaction
from services.voice_analyzer import analyze_voice_interaction
from services.demo_cases import get_demo_cases, get_demo_case_by_id
from config import SUPPORTED_LANGUAGES, DIALECT_EXPANSION_NOTICE

router = APIRouter(prefix="/api", tags=["Analysis"])

@router.get("/languages")
def get_languages():
    return {
        "supported_languages": SUPPORTED_LANGUAGES,
        "notice": DIALECT_EXPANSION_NOTICE
    }

@router.get("/demo-cases")
def get_demo_cases_list():
    return {
        "demo_cases": get_demo_cases(),
        "disclaimer": "FICTIONAL DEMONSTRATION DATA — Contains no real person's information."
    }

@router.post("/analyze-text", response_model=TextAnalysisResponse)
def analyze_text_endpoint(payload: TextAnalysisRequest, db: Session = Depends(get_db)):
    if not payload.text or len(payload.text.strip()) == 0:
        raise HTTPException(status_code=400, detail="Victim narrative text cannot be empty.")
        
    if not payload.consent:
        raise HTTPException(status_code=403, detail="User consent is required before interaction processing.")

    # Execute text NLP emotion analysis
    result = analyze_text_interaction(
        text=payload.text,
        language=payload.language,
        case_id=payload.case_id
    )

    # Save to SQLite audit record
    db_record = AssessmentRecord(
        case_id=result.get("case_id") or f"NHAA-{uuid.uuid4().hex[:6].upper()}",
        language=result["language"],
        analysis_type="Text",
        narrative_excerpt=payload.text[:200] + ("..." if len(payload.text) > 200 else ""),
        emotion_scores_json=json.dumps(result["emotion_scores"]),
        indicators_json=json.dumps(result["indicators"]),
        trauma_indicators_json=json.dumps(result["trauma_indicators"]),
        vulnerability_indicators_json=json.dumps(result["vulnerability_indicators"]),
        urgent_safety_indicators_json=json.dumps(result["urgent_safety_indicators"]),
        explainability_json=json.dumps(result["explainability"]),
        speech_features_json=None,
        urgent_review=result["urgent_review"],
        confidence=float(result["confidence"]),
        transcript=payload.text,
        consent=payload.consent
    )
    
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    
    result["record_id"] = db_record.id
    result["case_id"] = db_record.case_id
    
    return result

@router.post("/analyze-voice", response_model=VoiceAnalysisResponse)
async def analyze_voice_endpoint(
    language: str = Form("Tamil"),
    case_id: Optional[str] = Form(None),
    transcript: Optional[str] = Form(None),
    consent: bool = Form(True),
    audio_file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    if not consent:
        raise HTTPException(status_code=403, detail="User consent is required before interaction processing.")

    saved_filename = None
    if audio_file:
        saved_filename = audio_file.filename

    # Execute voice feature extraction & speech emotion analysis
    result = analyze_voice_interaction(
        audio_filename=saved_filename,
        transcript_text=transcript,
        language=language,
        case_id=case_id
    )

    # Save to SQLite audit database
    db_record = AssessmentRecord(
        case_id=result.get("case_id") or f"NHAA-VOICE-{uuid.uuid4().hex[:6].upper()}",
        language=result["language"],
        analysis_type="Voice",
        narrative_excerpt=result["transcript"][:200] + ("..." if len(result["transcript"]) > 200 else ""),
        emotion_scores_json=json.dumps(result["emotion_scores"]),
        indicators_json=json.dumps(result["indicators"]),
        trauma_indicators_json=json.dumps(result["trauma_indicators"]),
        vulnerability_indicators_json=json.dumps(result["vulnerability_indicators"]),
        urgent_safety_indicators_json=json.dumps(result["urgent_safety_indicators"]),
        explainability_json=json.dumps(result["explainability"]),
        speech_features_json=json.dumps(result["speech_features"]),
        urgent_review=result["urgent_review"],
        confidence=float(result["confidence"]),
        transcript=result["transcript"],
        consent=consent
    )

    db.add(db_record)
    db.commit()
    db.refresh(db_record)

    result["record_id"] = db_record.id
    result["case_id"] = db_record.case_id

    return result
