# MAIN ROUTER OF THE PROJECT
from fastapi import FastAPI, APIRouter

# Route imports
from app.api.routes import health

api_router = APIRouter()

# Health router
api_router.include_router(
    health.router,
    prefix="/health",
    tags=["Health"]
)