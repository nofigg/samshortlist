from sqlalchemy import Column, Integer, String, JSON, DateTime, ForeignKey, Float, Table
from sqlalchemy.orm import relationship
from datetime import datetime
from .base import Base

class Opportunity(Base):
    __tablename__ = "opportunities"

    id = Column(Integer, primary_key=True, index=True)
    notice_id = Column(String, unique=True, index=True)
    title = Column(String)
    description = Column(String)
    agency = Column(String, index=True)
    naics_code = Column(String, index=True)
    contract_value = Column(Float)
    response_deadline = Column(DateTime)
    location = Column(JSON)  # {address, city, state, zip, coordinates}
    requirements = Column(JSON)  # Specific contract requirements
    status = Column(String)  # active, expired, awarded
    source = Column(String)  # sam.gov, usaspending.gov
    source_data = Column(JSON)  # Raw data from source
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    business_id = Column(Integer, ForeignKey('businesses.id'))
    business = relationship("Business", back_populates="opportunities")
