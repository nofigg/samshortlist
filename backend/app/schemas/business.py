from pydantic import BaseModel, constr
from typing import Optional, List, Dict
from datetime import datetime

class BusinessBase(BaseModel):
    name: str
    cage_code: constr(regex=r'^[A-Z0-9]{5}$')
    duns: Optional[constr(regex=r'^\d{9}$')]
    location: Dict
    capabilities: Optional[Dict]
    past_performance: Optional[List[Dict]]
    certifications: Optional[Dict]

class BusinessCreate(BusinessBase):
    pass

class BusinessUpdate(BaseModel):
    name: Optional[str]
    location: Optional[Dict]
    capabilities: Optional[Dict]
    past_performance: Optional[List[Dict]]
    certifications: Optional[Dict]

class BusinessResponse(BusinessBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
