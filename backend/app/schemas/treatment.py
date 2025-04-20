from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, Field


class TreatmentBase(BaseModel):
    patient_id: int
    start_date: date
    end_date: Optional[date] = None
    medication_name: str
    dosage: str
    frequency: str
    is_active: bool = True
    is_responder: Optional[bool] = None
    efficacy_rating: Optional[float] = None
    notes: Optional[str] = None


class TreatmentCreate(TreatmentBase):
    pass


class TreatmentUpdate(BaseModel):
    end_date: Optional[date] = None
    medication_name: Optional[str] = None
    dosage: Optional[str] = None
    frequency: Optional[str] = None
    is_active: Optional[bool] = None
    is_responder: Optional[bool] = None
    efficacy_rating: Optional[float] = None
    notes: Optional[str] = None


class TreatmentInDB(TreatmentBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class Treatment(TreatmentInDB):
    pass
