from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update, delete

from app.database import get_db
from app.models.assessment import Assessment
from app.schemas.assessment import AssessmentCreate, Assessment as AssessmentSchema, AssessmentUpdate

router = APIRouter()


@router.post("/", response_model=AssessmentSchema)
async def create_assessment(assessment: AssessmentCreate, db: AsyncSession = Depends(get_db)):
    db_assessment = Assessment(**assessment.model_dump())
    db.add(db_assessment)
    await db.commit()
    await db.refresh(db_assessment)
    return db_assessment


@router.get("/", response_model=List[AssessmentSchema])
async def read_assessments(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Assessment).offset(skip).limit(limit))
    assessments = result.scalars().all()
    return assessments


@router.get("/patient/{patient_id}", response_model=List[AssessmentSchema])
async def read_patient_assessments(patient_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Assessment).filter(Assessment.patient_id == patient_id))
    assessments = result.scalars().all()
    return assessments


@router.get("/{assessment_id}", response_model=AssessmentSchema)
async def read_assessment(assessment_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Assessment).filter(Assessment.id == assessment_id))
    assessment = result.scalars().first()
    if assessment is None:
        raise HTTPException(status_code=404, detail="Assessment not found")
    return assessment


@router.patch("/{assessment_id}", response_model=AssessmentSchema)
async def update_assessment(
    assessment_id: int, assessment_update: AssessmentUpdate, db: AsyncSession = Depends(get_db)
):
    # Filter out None values
    update_data = {k: v for k, v in assessment_update.model_dump().items() if v is not None}
    
    if not update_data:
        # If no fields to update
        result = await db.execute(select(Assessment).filter(Assessment.id == assessment_id))
        assessment = result.scalars().first()
        if assessment is None:
            raise HTTPException(status_code=404, detail="Assessment not found")
        return assessment
    
    # Update assessment
    await db.execute(
        update(Assessment).where(Assessment.id == assessment_id).values(**update_data)
    )
    await db.commit()
    
    # Get updated assessment
    result = await db.execute(select(Assessment).filter(Assessment.id == assessment_id))
    updated_assessment = result.scalars().first()
    if updated_assessment is None:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    return updated_assessment


@router.delete("/{assessment_id}")
async def delete_assessment(assessment_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Assessment).filter(Assessment.id == assessment_id))
    assessment = result.scalars().first()
    if assessment is None:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    await db.execute(delete(Assessment).where(Assessment.id == assessment_id))
    await db.commit()
    
    return {"detail": "Assessment deleted successfully"}
