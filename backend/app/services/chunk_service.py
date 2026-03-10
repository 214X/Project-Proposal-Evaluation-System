from typing import List, Optional
from pydantic import BaseModel
import re

class Chunk(BaseModel):
    chunk_index: int
    section: str
    subsection: Optional[str] = None
    text: str
    length: int

def is_main_section_header(line: str) -> bool:
    """
    Detects main section headers like '1. ÖZGÜN DEĞER' or 'ÖZET'.
    """
    # Numbered main section (1. HEADING) or all caps.
    if re.match(r'^(\d+\.|[A-Z]\.)\s+[A-Za-zÇĞİÖŞÜçğıöşü]', line):
        return True
    if line.isupper() and len(line) > 2 and len(line) < 120:
        return True
    return False

def is_subsection_header(line: str) -> bool:
    """
    Detects subsection headers like '1.1. Konunun Önemi'.
    """
    # Numbered subsection (1.1. Subheading)
    if re.match(r'^(\d+\.\d+(\.\d+)*)\.?\s+[A-Za-zÇĞİÖŞÜçğıöşü]', line) and not line.isupper() and len(line) < 120:
        return True
    return False

def create_chunks(cleaned_text: str, target_size: int = 900, soft_limit: int = 1000, hard_limit: int = 1100, overlap_size: int = 120) -> List[Chunk]:
    if not cleaned_text:
        return []

    lines = cleaned_text.split('\n')
    
    # Represents the parsed document: List of tuples (section_name, subsection_name, section_text)
    sections = []
    
    current_section = "INTRODUCTION"
    current_subsection = None
    current_text_lines = []
    
    # Step 1: Split into sections and subsections
    for line in lines:
        line_stripped = line.strip()
        
        if is_main_section_header(line_stripped):
            if current_text_lines:
                sections.append((current_section, current_subsection, "\n".join(current_text_lines)))
            current_section = line_stripped
            current_subsection = None
            current_text_lines = []
        elif is_subsection_header(line_stripped):
            if current_text_lines:
                sections.append((current_section, current_subsection, "\n".join(current_text_lines)))
            current_subsection = line_stripped
            current_text_lines = []
        elif line_stripped:
            current_text_lines.append(line_stripped)
            
    if current_text_lines:
        sections.append((current_section, current_subsection, "\n".join(current_text_lines)))

    # Step 2 & 3: Chunking with advanced limits
    chunks = []
    chunk_index = 1
    
    def finalize_chunk(sec: str, subsec: Optional[str], text_buffer: str):
        nonlocal chunk_index
        text_buffer = text_buffer.strip()
        if not text_buffer:
            return
            
        header = f"SECTION: {sec}"
        if subsec:
            header += f"\nSUBSECTION: {subsec}"
            
        chunk_text = f"{header}\n\n{text_buffer}"
        
        # If final text somehow breaks hard limits, force cut it
        if len(chunk_text) > hard_limit:
            chunk_text = chunk_text[:hard_limit-3] + "..."
            
        chunks.append(Chunk(
            chunk_index=chunk_index,
            section=sec,
            subsection=subsec,
            text=chunk_text,
            length=len(chunk_text)
        ))
        chunk_index += 1

    for section_name, subsection_name, section_content in sections:
        paragraphs = section_content.split('\n\n')
        current_chunk_text = ""
        
        for paragraph in paragraphs:
            paragraph = paragraph.strip()
            if not paragraph:
                continue
                
            predicted_len = len(current_chunk_text) + len(paragraph) + 2 # +2 for \n\n
            
            # If adding this paragraph keeps us under the soft limit, we prefer to add it (it might break target_size but we allow it)
            if predicted_len <= soft_limit:
                current_chunk_text += paragraph + "\n\n"
            else:
                # If adding it breaks the soft limit, but current is less than target, and prediction is < hard
                if len(current_chunk_text) < target_size and predicted_len <= hard_limit:
                    current_chunk_text += paragraph + "\n\n"
                    finalize_chunk(section_name, subsection_name, current_chunk_text)
                    current_chunk_text = "" # Reset without overlap if paragraph perfectly matched hard limits
                else:
                    # Finalize current block
                    if current_chunk_text:
                        finalize_chunk(section_name, subsection_name, current_chunk_text)
                    
                    # Compute overlap for the next chunk
                    if len(current_chunk_text) > overlap_size:
                        overlap_text = current_chunk_text.strip()[-overlap_size:]
                        space_idx = overlap_text.find(' ')
                        if space_idx != -1:
                            overlap_text = overlap_text[space_idx+1:]
                        current_chunk_text = overlap_text + "\n\n"
                    else:
                        current_chunk_text = ""
                        
                    # Handle massive paragraphs > hard limit
                    if len(paragraph) > hard_limit:
                        # Forcibly split giant paragraph
                        sentences = re.split(r'(?<=[.!?])\s+', paragraph)
                        for sentence in sentences:
                            if len(current_chunk_text) + len(sentence) > target_size:
                                finalize_chunk(section_name, subsection_name, current_chunk_text)
                                current_chunk_text = sentence + " "
                            else:
                                current_chunk_text += sentence + " "
                        current_chunk_text += "\n\n"
                    else:
                        current_chunk_text += paragraph + "\n\n"
                        
        if current_chunk_text.strip():
            finalize_chunk(section_name, subsection_name, current_chunk_text)

    return chunks
