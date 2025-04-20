from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update, delete

from app.database import get_db
from app.models.treatment import Treatment
from app.schemas.treatment import TreatmentCreate, Treatment as TreatmentSchema, TreatmentUpdate

router = APIRouter()


@router.post("/", response_model=TreatmentSchema)
async def create_treatment(treatment: TreatmentCreate, db: AsyncSession = Depends(get_db)):
    db_treatment = Treatment(**treatment.model_dump())
    db.add(db_treatment)
    await db.commit()
    await db.refresh(db_treatment)
    return db_treatment


@router.get("/", response_model=List[TreatmentSchema])
async def read_treatments(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Treatment).offset(skip).limit(limit))
    treatments = result.scalars().all()
    return treatments


@router.get("/patient/{patient_id}", response_model=List[TreatmentSchema])
async def read_patient_treatments(patient_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Treatment).filter(Treatment.patient_id == patient_id))
    treatments = result.scalars().all()
    return treatments


@router.get("/{treatment_id}", response_model=TreatmentSchema)
async def read_treatment(treatment_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Treatment).filter(Treatment.id == treatment_id))
    treatment = result.scalars().first()
    if treatment is None:
        raise HTTPException(status_code=404, detail="Treatment not found")
    return treatment


@router.patch("/{treatment_id}", response_model=TreatmentSchema)
async def update_treatment(
    treatment_id: int, treatment_update: TreatmentUpdate, db: AsyncSession = Depends(get_db)
):
    # Filter out None values
    update_data = {k: v for k, v in treatment_update.model_dump().items() if v is not None}
    
    if not update_data:
        # If no fields to update
        result = await db.execute(select(Treatment).filter(Treatment.id == treatment_id))
        treatment = result.scalars().first()
        if treatment is None:
            raise HTTPException(status_code=404, detail="Treatment not found")
        return treatment
    
    # Update treatment
    await db.execute(
        update(Treatment).where(Treatment.id == treatment_id).values(**update_data)
    )
    await db.commit()
    
    # Get updated treatment
    result = await db.execute(select(Treatment).filter(Treatment.id == treatment_id))
    updated_treatment = result.scalars().first()
    if updated_treatment is None:
        raise HTTPException(status_code=404, detail="Treatment not found")
    
    return updated_treatment


@router.delete("/{treatment_id}")
async def delete_treatment(treatment_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Treatment).filter(Treatment.id == treatment_id))
    treatment = result.scalars().first()
    if treatment is None:
        raise HTTPException(status_code=404, detail="Treatment not found")
    
    await db.execute(delete(Treatment).where(Treatment.id == treatment_id))
    await db.commit()
    
    return {"detail": "Treatment deleted successfully"}
