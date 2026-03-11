from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from app.services.embedding_service import embedding_service
from app.services.vector_store import vector_store

router = APIRouter()

class SearchRequest(BaseModel):
    query: str
    top_k: int = 5
    proposal_id: Optional[str] = None

class SearchResponse(BaseModel):
    query: str
    results: List[Dict[str, Any]]

@router.post("/", response_model=SearchResponse)
async def search_proposals(req: SearchRequest):
    """
    Perform semantic search over proposal chunks globally.
    """
    if not req.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")
        
    try:
        # 1. Embed the query string
        query_embedding = embedding_service.embed_text(req.query)
        
        # 2. Search ChromaDB
        # Add metadata filtering constraints to strictly scope context
        where_filter = {"proposal_id": req.proposal_id} if req.proposal_id else None
        
        search_results = vector_store.search(
            query_embedding=query_embedding, 
            top_k=req.top_k, 
            where=where_filter
        )
        
        return SearchResponse(
            query=req.query,
            results=search_results
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")
