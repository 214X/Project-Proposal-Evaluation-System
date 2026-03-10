import os
import uuid
from typing import Dict, Any
from app.services.pdf_extractor import extract_text

# Define storage directory relative to the project root
# Or hardcode a preferred absolute path depending on the application structure
STORAGE_DIR = os.path.join(os.getcwd(), "storage", "proposals")

def process_uploaded_proposal(file_content: bytes, original_filename: str) -> Dict[str, Any]:
    """
    Processes an uploaded PDF proposal.
    - Generates a UUID filename
    - Saves the file to disk
    - Extracts text from the PDF
    
    Args:
        file_content (bytes): The bytes content of the uploaded PDF.
        original_filename (str): The original filename of the uploaded file.
        
    Returns:
        dict: A dictionary containing the file path and text length.
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
        
    # Extract text using the pdf extractor service
    extracted_text = extract_text(file_path)
    
    return {
        "file_path": file_path,
        "text_length": len(extracted_text),
        "text": extracted_text,
    }
