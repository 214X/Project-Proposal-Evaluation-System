from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
from app.services.evaluation_service import evaluate_proposal

router = APIRouter()

class EvaluationResult(BaseModel):
    category: str
    criteria: str
    score: int
    confidence: float
    reason: str
    evidence: str
    weight: int
    total: int

class EvaluationResponse(BaseModel):
    project_name: str
    results: List[EvaluationResult]
    total_score: int
    max_score: int

@router.post("/{proposal_id}", response_model=EvaluationResponse)
async def run_evaluation(proposal_id: str):
    """
    Evaluates a specific proposal by its ID against static criteria using the local LLaMA engine.
    """
    if not proposal_id or proposal_id.strip() == "":
        raise HTTPException(status_code=400, detail="A valid proposal_id is required.")
        
    try:
        # Trigger the evaluation orchestrator service
        report = evaluate_proposal(proposal_id)
        return report
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
