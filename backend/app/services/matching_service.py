from typing import List, Dict
from sqlalchemy.orm import Session
from app.models.business import Business
from app.models.opportunity import Opportunity
import numpy as np
from datetime import datetime

class MatchingService:
    def __init__(self, db: Session):
        self.db = db

    def calculate_match_score(
        self,
        business: Business,
        opportunity: Opportunity
    ) -> float:
        """
        Calculate a match score between a business and an opportunity
        Returns a score between 0 and 1
        """
        score = 0.0
        weights = {
            'naics_match': 0.4,
            'location_match': 0.2,
            'size_match': 0.2,
            'past_performance': 0.2
        }

        # NAICS code matching
        if opportunity.naics_code in [code.code for code in business.naics_codes]:
            score += weights['naics_match']

        # Location matching (if within same state)
        if business.location.get('state') == opportunity.location.get('state'):
            score += weights['location_match']

        # Contract size matching based on past performance
        avg_contract_value = np.mean([
            float(contract['value'])
            for contract in business.past_performance
            if contract.get('value')
        ]) if business.past_performance else 0

        if 0.5 * avg_contract_value <= opportunity.contract_value <= 2 * avg_contract_value:
            score += weights['size_match']

        # Past performance in similar contracts
        similar_contracts = [
            contract for contract in business.past_performance
            if contract.get('naics_code') == opportunity.naics_code
        ]
        if similar_contracts:
            score += weights['past_performance']

        return score

    def find_matches(
        self,
        business: Business,
        min_score: float = 0.6
    ) -> List[Dict]:
        """
        Find matching opportunities for a business
        Returns list of opportunities with match scores
        """
        opportunities = self.db.query(Opportunity).filter(
            Opportunity.status == 'active'
        ).all()

        matches = []
        for opportunity in opportunities:
            score = self.calculate_match_score(business, opportunity)
            if score >= min_score:
                matches.append({
                    'opportunity': opportunity,
                    'score': score,
                    'matched_at': datetime.utcnow()
                })

        # Sort matches by score in descending order
        matches.sort(key=lambda x: x['score'], reverse=True)
        return matches

    def find_businesses_for_opportunity(
        self,
        opportunity: Opportunity,
        min_score: float = 0.6
    ) -> List[Dict]:
        """
        Find matching businesses for an opportunity
        Returns list of businesses with match scores
        """
        businesses = self.db.query(Business).all()

        matches = []
        for business in businesses:
            score = self.calculate_match_score(business, opportunity)
            if score >= min_score:
                matches.append({
                    'business': business,
                    'score': score,
                    'matched_at': datetime.utcnow()
                })

        # Sort matches by score in descending order
        matches.sort(key=lambda x: x['score'], reverse=True)
        return matches
