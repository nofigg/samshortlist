import httpx
from typing import Dict, List, Optional
from datetime import datetime
from app.core.config import get_settings

settings = get_settings()

class USASpendingService:
    def __init__(self):
        self.api_key = settings.USASPENDING_API_KEY
        self.base_url = "https://api.usaspending.gov/api/v2"
        self.headers = {
            "X-Api-Key": self.api_key,
            "Accept": "application/json"
        }

    async def search_awards(
        self,
        recipient_duns: Optional[str] = None,
        naics_codes: Optional[List[str]] = None,
        award_type: Optional[str] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> List[Dict]:
        """
        Search for contract awards in USAspending.gov
        """
        filters = {
            "award_type_codes": [award_type] if award_type else ["A", "B", "C", "D"],
        }

        if recipient_duns:
            filters["recipient_search_text"] = recipient_duns
        if naics_codes:
            filters["naics_codes"] = naics_codes
        if start_date and end_date:
            filters["time_period"] = [
                {
                    "start_date": start_date.strftime("%Y-%m-%d"),
                    "end_date": end_date.strftime("%Y-%m-%d")
                }
            ]

        payload = {
            "filters": filters,
            "fields": [
                "award_id",
                "recipient_name",
                "recipient_duns",
                "total_obligation",
                "period_of_performance_start_date",
                "period_of_performance_current_end_date",
                "awarding_agency_name",
                "funding_agency_name",
                "naics_code",
                "naics_description"
            ]
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/search/spending_by_award",
                json=payload,
                headers=self.headers
            )
            response.raise_for_status()
            return response.json()["results"]

    async def get_recipient_profile(self, duns: str) -> Dict:
        """
        Get detailed profile information about a recipient
        """
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/recipient/duns/{duns}/",
                headers=self.headers
            )
            response.raise_for_status()
            return response.json()

    async def get_award_spending_summary(
        self,
        recipient_duns: str,
        fiscal_year: Optional[int] = None
    ) -> Dict:
        """
        Get summary of award spending for a recipient
        """
        params = {"recipient_duns": recipient_duns}
        if fiscal_year:
            params["fiscal_year"] = fiscal_year

        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/recipient/award_spending/summary/",
                params=params,
                headers=self.headers
            )
            response.raise_for_status()
            return response.json()

    async def get_subaward_count(
        self,
        award_id: str,
        recipient_duns: Optional[str] = None
    ) -> Dict:
        """
        Get count of subawards for a specific award
        """
        params = {
            "award_id": award_id,
        }
        if recipient_duns:
            params["recipient_duns"] = recipient_duns

        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/subawards/count/",
                params=params,
                headers=self.headers
            )
            response.raise_for_status()
            return response.json()
