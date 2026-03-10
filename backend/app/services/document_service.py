import os
import uuid
from typing import Dict, Any
from app.services.pdf_extractor import extract_text
from app.services.text_cleaner import clean_text
from app.services.chunk_service import create_chunks
from app.services.embedding_service import embedding_service

# Define storage directory relative to the project root
# Or hardcode a preferred absolute path depending on the application structure
STORAGE_DIR = os.path.join(os.getcwd(), "storage", "proposals")

def process_uploaded_proposal(file_content: bytes, original_filename: str) -> Dict[str, Any]:
    """
    Processes an uploaded PDF proposal.
    - Generates a UUID filename
    - Saves the file to disk
    - Extracts text from the PDF
    - Cleans and normalizes the text
    - Chunks the text by section
    
    Args:
        file_content (bytes): The bytes content of the uploaded PDF.
        original_filename (str): The original filename of the uploaded file.
        
    Returns:
        dict: A dictionary containing the file path, raw text, cleaned text, and chunks.
    """
    # Ensure storage directory exists
    os.makedirs(STORAGE_DIR, exist_ok=True)
    
    # Generate unique filename
    file_uuid = str(uuid.uuid4())
    file_extension = os.path.splitext(original_filename)[1]
    if not file_extension:
        file_extension = ".pdf"
        
    new_filename = f"{file_uuid}{file_extension}"
    file_path = os.path.join(STORAGE_DIR, new_filename)
    
    # Save the file to disk
    with open(file_path, "wb") as f:
        f.write(file_content)
        
    # Extract raw text using the pdf extractor service
    raw_text = extract_text(file_path)
    
    # Clean and normalize text
    cleaned_text = clean_text(raw_text)
    
    # Generate section-aware chunks
    chunks = create_chunks(cleaned_text)
    
    # Generate embeddings
    embedding_results = embedding_service.embed_chunks(chunks)
    embeddings_generated = len(embedding_results)
    embedding_dimension = embedding_results[0]["dimension"] if embedding_results else 0
    
    # Serialize chunks for the JSON response
    serialized_chunks = [chunk.model_dump() for chunk in chunks]
    
    return {
        "file_path": file_path,
        "text_length": len(raw_text),
        "raw_text": raw_text,
        "cleaned_text": cleaned_text,
        "chunks": serialized_chunks,
        "embeddings_generated": embeddings_generated,
        "embedding_dimension": embedding_dimension,
    }

