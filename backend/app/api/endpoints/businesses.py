from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.session import get_db
from app.services.sam_service import SAMService
from app.services.matching_service import MatchingService
from app.models.business import Business
from app.schemas.business import BusinessCreate, BusinessUpdate, BusinessResponse
import json

router = APIRouter()

@router.post("/businesses/", response_model=BusinessResponse)
async def create_business(
    business: BusinessCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new business profile
    """
    # Check if business with CAGE code already exists
    existing = db.query(Business).filter(
        Business.cage_code == business.cage_code
    ).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Business with this CAGE code already exists"
        )
    
    # Create new business
    db_business = Business(**business.dict())
    db.add(db_business)
    db.commit()
    db.refresh(db_business)
    return db_business

@router.get("/businesses/{business_id}", response_model=BusinessResponse)
async def get_business(
    business_id: int,
    db: Session = Depends(get_db)
):
    """
    Get detailed information about a specific business
    """
    business = db.query(Business).filter(Business.id == business_id).first()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    return business

@router.put("/businesses/{business_id}", response_model=BusinessResponse)
async def update_business(
    business_id: int,
    business_update: BusinessUpdate,
    db: Session = Depends(get_db)
):
    """
    Update a business profile
    """
    db_business = db.query(Business).filter(Business.id == business_id).first()
    if not db_business:
        raise HTTPException(status_code=404, detail="Business not found")
    
    # Update business fields
    for field, value in business_update.dict(exclude_unset=True).items():
        setattr(db_business, field, value)
    
    db.commit()
    db.refresh(db_business)
    return db_business

@router.post("/businesses/{business_id}/capability-statement")
async def upload_capability_statement(
    business_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Upload a capability statement PDF for a business
    """
    if not file.filename.endswith('.pdf'):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are accepted"
        )
    
    business = db.query(Business).filter(Business.id == business_id).first()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    
    # TODO: Implement file storage logic (e.g., S3)
    # For now, we'll just update the capabilities field
    capabilities = business.capabilities or {}
    capabilities['capability_statement'] = {
        'filename': file.filename,
        'uploaded_at': datetime.utcnow().isoformat()
    }
    
    business.capabilities = capabilities
    db.commit()
    
    return {"message": "Capability statement uploaded successfully"}

@router.get("/businesses/{business_id}/matching-opportunities")
async def get_matching_opportunities(
    business_id: int,
    db: Session = Depends(get_db),
    min_score: float = 0.6,
    status: Optional[str] = "active"
):
    """
    Get opportunities that match with a specific business
    """
    business = db.query(Business).filter(Business.id == business_id).first()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    
    matching_service = MatchingService(db)
    matches = matching_service.find_matches(
        business=business,
        min_score=min_score
    )
    
    # Filter by status if provided
    if status:
        matches = [
            match for match in matches
            if match['opportunity'].status == status
        ]
    
    return matches

@router.post("/businesses/{business_id}/sync")
async def sync_business_data(
    business_id: int,
    db: Session = Depends(get_db)
):
    """
    Sync business data from SAM.gov
    """
    business = db.query(Business).filter(Business.id == business_id).first()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    
    sam_service = SAMService()
    
    try:
        # Get updated entity information from SAM.gov
        entity_data = await sam_service.get_entity_details(business.cage_code)
        
        # Update business information
        business.name = entity_data.get("entityName")
        business.duns = entity_data.get("dunsNumber")
        business.location = {
            "address": entity_data.get("address", {}),
            "coordinates": entity_data.get("coordinates", {})
        }
        
        # Update certifications
        if "certifications" in entity_data:
            business.certifications = entity_data["certifications"]
        
        db.commit()
        
        return {"message": "Business data synced successfully"}
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to sync business data: {str(e)}"
        )
