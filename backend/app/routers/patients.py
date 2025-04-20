from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update, delete

from app.database import get_db
from app.models.patient import Patient
from app.schemas.patient import PatientCreate, Patient as PatientSchema, PatientUpdate

router = APIRouter()


@router.post("/", response_model=PatientSchema)
async def create_patient(patient: PatientCreate, db: AsyncSession = Depends(get_db)):
    db_patient = Patient(**patient.model_dump())
    db.add(db_patient)
    await db.commit()
    await db.refresh(db_patient)
    return db_patient


@router.get("/", response_model=List[PatientSchema])
async def read_patients(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Patient).offset(skip).limit(limit))
    patients = result.scalars().all()
    return patients


@router.get("/{patient_id}", response_model=PatientSchema)
async def read_patient(patient_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Patient).filter(Patient.id == patient_id))
    patient = result.scalars().first()
    if patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient


@router.patch("/{patient_id}", response_model=PatientSchema)
async def update_patient(
    patient_id: int, patient_update: PatientUpdate, db: AsyncSession = Depends(get_db)
):
    # Filter out None values
    update_data = {k: v for k, v in patient_update.model_dump().items() if v is not None}
    
    if not update_data:
        # If no fields to update
        result = await db.execute(select(Patient).filter(Patient.id == patient_id))
        patient = result.scalars().first()
        if patient is None:
            raise HTTPException(status_code=404, detail="Patient not found")
        return patient
    
    # Update patient
    await db.execute(
        update(Patient).where(Patient.id == patient_id).values(**update_data)
    )
    await db.commit()
    
    # Get updated patient
    result = await db.execute(select(Patient).filter(Patient.id == patient_id))
    updated_patient = result.scalars().first()
    if updated_patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    return updated_patient


@router.delete("/{patient_id}")
async def delete_patient(patient_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Patient).filter(Patient.id == patient_id))
    patient = result.scalars().first()
    if patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    await db.execute(delete(Patient).where(Patient.id == patient_id))
    await db.commit()
    
    return {"detail": "Patient deleted successfully"}
