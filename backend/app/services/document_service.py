import os
import uuid
from typing import Dict, Any
from app.services.pdf_extractor import extract_text
from app.services.text_cleaner import clean_text

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
    
    Args:
        file_content (bytes): The bytes content of the uploaded PDF.
        original_filename (str): The original filename of the uploaded file.
        
    Returns:
        dict: A dictionary containing the file path, raw text, and cleaned text.
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
    
    return {
        "file_path": file_path,
        "text_length": len(raw_text),
        "raw_text": raw_text,
        "cleaned_text": cleaned_text,
    }

