from fastapi import FastAPI
from app.api.router import api_router

# create a FastAPI app
app = FastAPI(
    title="Project Proposal Evaluation API",
    description="AI system for evaluating research proposals",
    version="1.0"
)

# include the api router
app.include_router(api_router)