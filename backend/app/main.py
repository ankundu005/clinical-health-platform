from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import patients, assessments, treatments

app = FastAPI(
    title="Clinical Health Platform API",
    description="API for depression treatment with executive control network dysfunction",
    version="0.1.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(patients.router, prefix="/api/patients", tags=["patients"])
app.include_router(assessments.router, prefix="/api/assessments", tags=["assessments"])
app.include_router(treatments.router, prefix="/api/treatments", tags=["treatments"])


@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok"}
