from sqlalchemy import Column, Integer, String, Date, Float, Boolean, Text, ForeignKey
from sqlalchemy.orm import relationship

from app.models.base import Base, TimeStampMixin


class Patient(Base, TimeStampMixin):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    date_of_birth = Column(Date, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String)
    
    # Fields related to executive control network dysfunction
    ecn_dysfunction_confirmed = Column(Boolean, default=False)
    inflammatory_markers_level = Column(Float)
    
    # Relationships
    assessments = relationship("Assessment", back_populates="patient")
    treatments = relationship("Treatment", back_populates="patient")
