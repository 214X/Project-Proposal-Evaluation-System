# Health router of the project
from fastapi import FastAPI, APIRouter

router = APIRouter()

@router.get("/check")
def check():
    return {
        "status": "ok",
        "service": "project-evaluation-api"
    }