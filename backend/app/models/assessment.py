from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey, JSON, Text
from sqlalchemy.orm import relationship

from app.models.base import Base, TimeStampMixin


class Assessment(Base, TimeStampMixin):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    assessment_date = Column(Date, nullable=False)
    assessment_type = Column(String, nullable=False)  # e.g., "fMRI", "WPAI", "N-back Task"
    
    # Specific fields for different assessment types
    fmri_data = Column(JSON, nullable=True)  # JSON field for fMRI results
    n_back_task_score = Column(Float, nullable=True)
    wpai_score = Column(Float, nullable=True)  # Work Productivity and Activity Impairment
    
    # Inflammatory biomarkers
    crp_level = Column(Float, nullable=True)  # C-reactive protein
    il6_level = Column(Float, nullable=True)  # Interleukin-6
    tnf_alpha_level = Column(Float, nullable=True)  # Tumor necrosis factor alpha
    
    notes = Column(Text, nullable=True)
    
    # Relationships
    patient = relationship("Patient", back_populates="assessments")
