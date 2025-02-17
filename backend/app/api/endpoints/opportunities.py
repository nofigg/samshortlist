from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.db.session import get_db
from app.services.sam_service import SAMService
from app.services.usaspending_service import USASpendingService
from app.services.matching_service import MatchingService
from app.models.opportunity import Opportunity
from app.schemas.opportunity import OpportunityCreate, OpportunityResponse

router = APIRouter()

@router.get("/opportunities/", response_model=List[OpportunityResponse])
async def list_opportunities(
    db: Session = Depends(get_db),
    naics_code: Optional[str] = None,
    agency: Optional[str] = None,
    min_value: Optional[float] = None,
    max_value: Optional[float] = None,
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 100
):
    """
    List opportunities with optional filters
    """
    query = db.query(Opportunity)
    
    if naics_code:
        query = query.filter(Opportunity.naics_code == naics_code)
    if agency:
        query = query.filter(Opportunity.agency == agency)
    if min_value:
        query = query.filter(Opportunity.contract_value >= min_value)
    if max_value:
        query = query.filter(Opportunity.contract_value <= max_value)
    if status:
        query = query.filter(Opportunity.status == status)
    
    opportunities = query.offset(skip).limit(limit).all()
    return opportunities

@router.get("/opportunities/{opportunity_id}", response_model=OpportunityResponse)
async def get_opportunity(
    opportunity_id: int,
    db: Session = Depends(get_db)
):
    """
    Get detailed information about a specific opportunity
    """
    opportunity = db.query(Opportunity).filter(Opportunity.id == opportunity_id).first()
    if not opportunity:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    return opportunity

@router.post("/opportunities/sync")
async def sync_opportunities(
    db: Session = Depends(get_db),
    days_back: int = Query(default=7, le=30)
):
    """
    Sync opportunities from SAM.gov and USAspending.gov
    """
    sam_service = SAMService()
    usaspending_service = USASpendingService()
    
    # Fetch new opportunities from SAM.gov
    opportunities = await sam_service.search_opportunities(
        posted_from=(datetime.now() - timedelta(days=days_back))
    )
    
    new_count = 0
    updated_count = 0
    
    for opp_data in opportunities:
        # Check if opportunity already exists
        existing = db.query(Opportunity).filter(
            Opportunity.notice_id == opp_data["noticeId"]
        ).first()
        
        if existing:
            # Update existing opportunity
            for key, value in opp_data.items():
                setattr(existing, key, value)
            updated_count += 1
        else:
            # Create new opportunity
            new_opp = OpportunityCreate(**opp_data)
            db_opp = Opportunity(**new_opp.dict())
            db.add(db_opp)
            new_count += 1
    
    db.commit()
    
    return {
        "message": "Sync completed",
        "new_opportunities": new_count,
        "updated_opportunities": updated_count
    }

@router.get("/opportunities/{opportunity_id}/matching-businesses")
async def get_matching_businesses(
    opportunity_id: int,
    db: Session = Depends(get_db),
    min_score: float = Query(default=0.6, ge=0, le=1)
):
    """
    Get businesses that match with a specific opportunity
    """
    opportunity = db.query(Opportunity).filter(Opportunity.id == opportunity_id).first()
    if not opportunity:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    
    matching_service = MatchingService(db)
    matches = matching_service.find_businesses_for_opportunity(
        opportunity=opportunity,
        min_score=min_score
    )
    
    return matches
