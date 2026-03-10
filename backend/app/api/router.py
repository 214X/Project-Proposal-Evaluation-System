# MAIN ROUTER OF THE PROJECT
from fastapi import FastAPI, APIRouter

# Route imports
from app.api.routes import health
from app.api.routes import proposal

api_router = APIRouter()

# Health router
api_router.include_router(
    health.router,
    prefix="/health",
    tags=["Health"]
)

# Proposal router
api_router.include_router(
    proposal.router,
    prefix="/proposals",
    tags=["Proposals"]
)