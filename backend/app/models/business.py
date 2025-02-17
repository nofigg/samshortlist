from sqlalchemy import Column, Integer, String, JSON, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship
from datetime import datetime
from .base import Base

# Association tables
business_naics = Table(
    'business_naics',
    Base.metadata,
    Column('business_id', Integer, ForeignKey('businesses.id')),
    Column('naics_code', String)
)

class Business(Base):
    __tablename__ = "businesses"

    id = Column(Integer, primary_key=True, index=True)
    cage_code = Column(String, unique=True, index=True)
    name = Column(String, index=True)
    duns = Column(String, unique=True, index=True)
    location = Column(JSON)  # {address, city, state, zip, coordinates}
    capabilities = Column(JSON)  # List of capability statements
    past_performance = Column(JSON)  # Historical contract performance data
    certifications = Column(JSON)  # Small business certifications
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    naics_codes = relationship("NAICSCode", secondary=business_naics)
    opportunities = relationship("Opportunity", back_populates="business")
