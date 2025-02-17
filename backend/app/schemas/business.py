from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime
import re

def validate_cage_code(v: str) -> str:
    if not re.match(r'^[A-Z0-9]{5}$', v):
        raise ValueError('CAGE code must be 5 alphanumeric characters')
    return v

def validate_duns(v: str) -> str:
    if not re.match(r'^\d{9}$', v):
        raise ValueError('DUNS number must be 9 digits')
    return v

class BusinessBase(BaseModel):
    name: str
    cage_code: str = Field(validation_alias='cage_code', validators=[validate_cage_code])
    duns: Optional[str] = Field(None, validation_alias='duns', validators=[validate_duns])
    location: Dict
    capabilities: Optional[Dict] = None
    past_performance: Optional[List[Dict]] = None
    certifications: Optional[Dict] = None

class BusinessCreate(BusinessBase):
    pass

class BusinessUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[Dict] = None
    capabilities: Optional[Dict] = None
    past_performance: Optional[List[Dict]] = None
    certifications: Optional[Dict] = None

class BusinessResponse(BusinessBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
