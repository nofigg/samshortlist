import httpx
from typing import Dict, List, Optional
from datetime import datetime
from app.core.config import get_settings

settings = get_settings()

class SAMService:
    def __init__(self):
        self.api_key = settings.SAM_API_KEY
        self.base_url = "https://api.sam.gov/entity-information/v3"
        self.headers = {
            "X-Api-Key": self.api_key,
            "Accept": "application/json"
        }

    async def search_opportunities(
        self,
        naics_code: Optional[str] = None,
        keyword: Optional[str] = None,
        posted_from: Optional[datetime] = None,
        posted_to: Optional[datetime] = None,
        limit: int = 100
    ) -> List[Dict]:
        """
        Search for subcontracting opportunities in SAM.gov
        """
        params = {
            "api_key": self.api_key,
            "limit": limit,
        }

        if naics_code:
            params["naicsCode"] = naics_code
        if keyword:
            params["keywords"] = keyword
        if posted_from:
            params["postedFrom"] = posted_from.isoformat()
        if posted_to:
            params["postedTo"] = posted_to.isoformat()

        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/opportunities",
                params=params,
                headers=self.headers
            )
            response.raise_for_status()
            return response.json()["opportunities"]

    async def get_entity_details(self, cage_code: str) -> Dict:
        """
        Get detailed information about an entity using CAGE code
        """
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/entities",
                params={"cageCode": cage_code},
                headers=self.headers
            )
            response.raise_for_status()
            return response.json()["entityData"]

    async def get_contract_awards(
        self,
        duns_number: str,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> List[Dict]:
        """
        Get contract awards for a specific entity using DUNS number
        """
        params = {
            "api_key": self.api_key,
            "dunsNumber": duns_number
        }

        if start_date:
            params["startDate"] = start_date.isoformat()
        if end_date:
            params["endDate"] = end_date.isoformat()

        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/awards",
                params=params,
                headers=self.headers
            )
            response.raise_for_status()
            return response.json()["awards"]
