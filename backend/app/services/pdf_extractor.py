import fitz  # PyMuPDF

def extract_text(file_path: str) -> str:
    """
    Extracts raw text from a PDF file.
    
    Args:
        file_path (str): The path to the PDF file.
        
    Returns:
        str: The extracted text.
    """
    try:
        doc = fitz.open(file_path)
        text = ""
        for page in doc:
            text += page.get_text()
        return text
    except Exception as e:
        raise RuntimeError(f"Failed to extract text from PDF: {str(e)}")
