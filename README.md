# Sam Shortlist

A powerful platform connecting businesses with subcontracting opportunities through real-time data integration with SAM.gov and USAspending.gov.

## Features

- Real-time data collection from SAM.gov and USAspending.gov
- Intelligent cross-referencing of opportunities
- Business matchmaking system
- Dynamic business profile management
- Automated lead generation and outreach
- Real-time notifications

## Tech Stack

- **Frontend**: Next.js, TailwindCSS, ShadCN
- **Backend**: FastAPI
- **Database**: PostgreSQL, Redis
- **Authentication**: Clerk
- **Hosting**: Vercel (frontend), Railway (backend)
- **APIs**: SAM.gov, USAspending.gov, OpenAI, Twilio

## Project Structure

```
samshortlist/
├── frontend/           # Next.js frontend application
├── backend/            # FastAPI backend application
├── database/           # Database migrations and schemas
├── common/            # Shared types and utilities
└── docs/              # Project documentation
```

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.9+
- PostgreSQL 14+
- Redis 6+

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/nofigg/samshortlist.git
   cd samshortlist
   ```

2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # or `venv\Scripts\activate` on Windows
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```bash
   cp frontend/.env.example frontend/.env.local
   cp backend/.env.example backend/.env
   ```

5. Start the development servers:
   ```bash
   # Frontend
   cd frontend
   npm run dev

   # Backend
   cd backend
   uvicorn app.main:app --reload
   ```

## License

MIT
