from pydantic import BaseModel
from typing import Optional, Dict
from datetime import datetime

class OpportunityBase(BaseModel):
    notice_id: str
    title: str
    description: str
    agency: str
    naics_code: str
    contract_value: float
    response_deadline: datetime
    location: Dict
    requirements: Optional[Dict]
    status: str
    source: str
    source_data: Optional[Dict]

class OpportunityCreate(OpportunityBase):
    pass

class OpportunityUpdate(BaseModel):
    title: Optional[str]
    description: Optional[str]
    contract_value: Optional[float]
    response_deadline: Optional[datetime]
    requirements: Optional[Dict]
    status: Optional[str]
    source_data: Optional[Dict]

class OpportunityResponse(OpportunityBase):
    id: int
    created_at: datetime
    updated_at: datetime
    business_id: Optional[int]

    class Config:
        orm_mode = True
