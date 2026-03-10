from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.router import api_router

# create a FastAPI app
app = FastAPI(
    title="Project Proposal Evaluation API",
    description="AI system for evaluating research proposals",
    version="1.0"
)

# Set up CORS middleware to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js dev server default
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# include the api router
app.include_router(api_router)