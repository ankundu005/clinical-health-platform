from datetime import date, datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field


class PatientBase(BaseModel):
    first_name: str
    last_name: str
    date_of_birth: date
    email: EmailStr
    phone: Optional[str] = None
    ecn_dysfunction_confirmed: Optional[bool] = False
    inflammatory_markers_level: Optional[float] = None


class PatientCreate(PatientBase):
    pass


class PatientUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    date_of_birth: Optional[date] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    ecn_dysfunction_confirmed: Optional[bool] = None
    inflammatory_markers_level: Optional[float] = None


class PatientInDB(PatientBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class Patient(PatientInDB):
    pass
