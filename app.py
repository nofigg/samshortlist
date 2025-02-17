from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

SAM_API_KEY = os.getenv('SAM_API_KEY')
USASPENDING_API_BASE_URL = os.getenv('USASPENDING_API_BASE_URL')
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
        
        # Basic filter for recent awards
        payload = {
            "filters": {
                "time_period": [
                    {
                        "start_date": request.args.get('start_date', "2024-01-01"),
                        "end_date": request.args.get('end_date', "2025-12-31")
                    }
                ]
            },
            "fields": [
                "Award ID",
                "Recipient Name",
                "Award Amount",
                "Description",
                "Award Type",
                "Funding Agency"
            ],
            "page": int(request.args.get('page', 1)),
            "limit": int(request.args.get('limit', 10)),
            "sort": "Award Amount",
            "order": "desc"
        }

        response = requests.post(endpoint, json=payload)
        return jsonify(response.json())

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
