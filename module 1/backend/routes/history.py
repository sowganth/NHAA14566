from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database.db import get_db
from database.models import AssessmentRecord
from schemas.analysis_schema import AssessmentRecordSchema

router = APIRouter(prefix="/api/assessments", tags=["History & Audit"])

@router.get("", response_model=List[AssessmentRecordSchema])
def get_assessment_history(limit: int = 20, db: Session = Depends(get_db)):
    records = db.query(AssessmentRecord).order_by(AssessmentRecord.created_at.desc()).limit(limit).all()
    return [r.to_dict() for r in records]

@router.get("/{record_id}", response_model=AssessmentRecordSchema)
def get_assessment_detail(record_id: int, db: Session = Depends(get_db)):
    record = db.query(AssessmentRecord).filter(AssessmentRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Assessment audit record not found.")
    return record.to_dict()
