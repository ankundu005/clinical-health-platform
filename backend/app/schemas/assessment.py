from datetime import date, datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field


class AssessmentBase(BaseModel):
    patient_id: int
    assessment_date: date
    assessment_type: str
    fmri_data: Optional[Dict[str, Any]] = None
    n_back_task_score: Optional[float] = None
    wpai_score: Optional[float] = None
    crp_level: Optional[float] = None
    il6_level: Optional[float] = None
    tnf_alpha_level: Optional[float] = None
    notes: Optional[str] = None


class AssessmentCreate(AssessmentBase):
    pass


class AssessmentUpdate(BaseModel):
    assessment_date: Optional[date] = None
    assessment_type: Optional[str] = None
    fmri_data: Optional[Dict[str, Any]] = None
    n_back_task_score: Optional[float] = None
    wpai_score: Optional[float] = None
    crp_level: Optional[float] = None
    il6_level: Optional[float] = None
    tnf_alpha_level: Optional[float] = None
    notes: Optional[str] = None


class AssessmentInDB(AssessmentBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class Assessment(AssessmentInDB):
    pass
