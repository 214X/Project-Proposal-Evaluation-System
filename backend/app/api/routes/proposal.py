from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.document_service import process_uploaded_proposal

router = APIRouter()

@router.post("/upload")
async def upload_proposal(file: UploadFile = File(...)):
    """
    Uploads a research proposal PDF and extracts its text.
    """
    # Validate file type
    if not file.filename.lower().endswith(".pdf"):
        if file.content_type != "application/pdf":
            raise HTTPException(status_code=400, detail="Only PDF files are supported.")
            
    try:
        # Read the file content
        file_content = await file.read()
        
        # Process the proposal
        result = process_uploaded_proposal(file_content, file.filename)
        
        return {
            "message": "Proposal uploaded successfully",
            "file_path": result["file_path"],
            "text_length": result["text_length"],
            "raw_text": result["raw_text"],
            "cleaned_text": result["cleaned_text"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while processing the proposal: {str(e)}")
