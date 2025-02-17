from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import opportunities, businesses, auth
from app.core.config import get_settings
from app.db.session import engine
from app.models import base

settings = get_settings()

# Create database tables
base.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Sam Shortlist API",
    description="API for matching businesses with subcontracting opportunities",
    version="0.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(
    auth.router,
    prefix="/api/v1/auth",
    tags=["auth"]
)

app.include_router(
    opportunities.router,
    prefix="/api/v1",
    tags=["opportunities"]
)

app.include_router(
    businesses.router,
    prefix="/api/v1",
    tags=["businesses"]
)

@app.get("/")
async def root():
    return {"message": "Welcome to Sam Shortlist API"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "version": settings.VERSION,
        "database": "connected"
    }
