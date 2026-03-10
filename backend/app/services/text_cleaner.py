import re

def clean_text(raw_text: str) -> str:
    """
    Normalizes and cleans the extracted PDF text before chunking.
    
    Cleaning rules applied:
    1. Removes excessive whitespace.
    2. Collapses multiple blank lines.
    3. Merges broken lines that belong to the same sentence.
    4. Removes standalone page numbers.
    5. Removes repeated header/footer text.
    
    Args:
        raw_text (str): The raw extracted text from the PDF.
        
    Returns:
        str: The cleaned and normalized text.
    """
    if not raw_text:
        return ""

    # 1. Remove excessive whitespace horizontally (keep newlines for now)
    # Replaces 2 or more spaces or tabs with a single space
    cleaned = re.sub(r'[ \t]+', ' ', raw_text)
    
    # 2. Remove known repeated header/footer text
    known_headers = [
        r"2209/A ÜNİVERSİTE ÖĞRENCİLERİ ARAŞTIRMA PROJELERİ DESTEĞİ PROGRAMI",
        # Add more typical headers here if needed
    ]
    for header in known_headers:
        cleaned = re.sub(f"(?i){header}", "", cleaned)
        
    # Split text into lines to process line-by-line rules
    lines = cleaned.split('\n')
    processed_lines = []
    
    for line in lines:
        line = line.strip()
        
        # Skip completely empty lines temporarily (handled later)
        if not line:
            processed_lines.append("")
            continue
            
        # 3. Remove standalone page numbers (e.g., just "1", "22", "- 3 -")
        if re.match(r'^[-—\s]*\d+[-—\s]*$', line):
            continue
            
        processed_lines.append(line)
        
    # 4. Merge broken lines belonging to the same sentence
    # and preserve paragraph structure.
    merged_text = ""
    for i, line in enumerate(processed_lines):
        if not line:
            merged_text += "\n"
            continue
            
        # If the line ends with a sentence ender, or if it looks like a section header (all caps/numbered)
        # we consider it the end of a line/paragraph.
        # Otherwise, if the *next* line is not empty, it's likely a broken sentence and we should merge it.
        
        is_end_of_sentence = re.search(r'[.?!:;]$', line)
        
        # Check if it looks like a section header (e.g., "1. ÖZGÜN DEĞER", "ÖZET")
        is_section_header = re.match(r'^(\d+\.)?\s*[A-ZÇĞİÖŞÜ\s]+$', line)
        
        # If the next line is empty, this line is naturally the end of the paragraph
        next_line_empty = (i + 1 < len(processed_lines) and not processed_lines[i + 1])
        
        if is_end_of_sentence or is_section_header or next_line_empty:
            merged_text += line + "\n"
        else:
            # It's a broken line, append with a space instead of a newline
            merged_text += line + " "

    # 5. Collapse multiple blank lines into a single blank line
    # (i.e. normalize paragraph spacing)
    final_cleaned = re.sub(r'\n{2,}', '\n\n', merged_text)
    
    return final_cleaned.strip()
