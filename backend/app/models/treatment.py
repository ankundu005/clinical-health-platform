from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship

from app.models.base import Base, TimeStampMixin


class Treatment(Base, TimeStampMixin):
    __tablename__ = "treatments"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=True)
    
    # Treatment details
    medication_name = Column(String, nullable=False)  # e.g., "Ibuprofen"
    dosage = Column(String, nullable=False)  # e.g., "400mg TID"
    frequency = Column(String, nullable=False)  # e.g., "3 times daily"
    
    # Treatment response tracking
    is_active = Column(Boolean, default=True)
    is_responder = Column(Boolean, nullable=True)
    efficacy_rating = Column(Float, nullable=True)  # Scale 1-10
    
    notes = Column(Text, nullable=True)
    
    # Relationships
    patient = relationship("Patient", back_populates="treatments")
