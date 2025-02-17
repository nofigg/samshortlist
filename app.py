from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

SAM_API_KEY = os.getenv('SAM_API_KEY')
USASPENDING_API_BASE_URL = 'https://api.usaspending.gov/api/v2'
SAM_API_BASE_URL = 'https://api.sam.gov/opportunities/v2/search'

@app.route('/api/opportunities', methods=['GET'])
def get_opportunities():
    try:
        # SAM.gov API parameters
        sam_params = {
            'api_key': SAM_API_KEY,
            'postedFrom': request.args.get('posted_from'),
            'postedTo': request.args.get('posted_to'),
            'limit': request.args.get('limit', 10),
            'offset': request.args.get('offset', 0)
        }
        
        # Call SAM.gov API
        sam_response = requests.get(
            SAM_API_BASE_URL,
            params=sam_params
        )
        sam_data = sam_response.json()

        return jsonify({
            'sam_opportunities': sam_data.get('opportunitiesData', [])
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/spending', methods=['GET'])
def get_spending_data():
    try:
        # USAspending.gov API endpoint for awards
        endpoint = f"{USASPENDING_API_BASE_URL}/search/spending_by_award/"
        
        # Get filter parameters from request
        keyword = request.args.get('keyword', '')
        award_type = request.args.get('award_type', '')
        agency = request.args.get('agency', '')
        min_amount = request.args.get('min_amount', '')
        max_amount = request.args.get('max_amount', '')
        
        # Build filters
        filters = {
            "time_period": [
                {
                    "start_date": request.args.get('start_date', "2024-01-01"),
                    "end_date": request.args.get('end_date', "2025-12-31")
                }
            ],
            "keywords": [keyword] if keyword else [],
        }
        
        # Add optional filters
        if award_type:
            filters['award_type_codes'] = [award_type]
        if agency:
            filters['agencies'] = [{
                'type': 'awarding',
                'tier': 'toptier',
                'name': agency
            }]
        if min_amount or max_amount:
            filters['award_amounts'] = [{
                'lower_bound': float(min_amount) if min_amount else 0,
                'upper_bound': float(max_amount) if max_amount else None
            }]

        payload = {
            "filters": filters,
            "fields": [
                "award_id",
                "recipient_name",
                "total_obligation",
                "description",
                "award_type",
                "awarding_agency_name",
                "funding_agency_name",
                "period_of_performance_start_date",
                "period_of_performance_current_end_date",
                "place_of_performance_city",
                "place_of_performance_state",
                "place_of_performance_zip5"
            ],
            "page": int(request.args.get('page', 1)),
            "limit": int(request.args.get('limit', 10)),
            "sort": request.args.get('sort', 'total_obligation'),
            "order": request.args.get('order', 'desc')
        }

        response = requests.post(endpoint, json=payload)
        data = response.json()
        
        return jsonify({
            'records': data.get('results', []),
            'total': data.get('page_metadata', {}).get('total', 0),
            'page': int(request.args.get('page', 1)),
            'limit': int(request.args.get('limit', 10))
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
