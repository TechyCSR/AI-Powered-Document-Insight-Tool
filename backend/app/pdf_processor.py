import pdfplumber
import tempfile
import os
from typing import str
import logging

logger = logging.getLogger(__name__)


class PDFProcessor:
    """Service for extracting text from PDF files"""
    
    @staticmethod
    async def extract_text_from_pdf(file_content: bytes, filename: str) -> str:
        """
        Extract text from PDF file bytes
        Returns: extracted text as string
        """
        try:
            # Create a temporary file to process the PDF
            with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
                temp_file.write(file_content)
                temp_file_path = temp_file.name
            
            try:
                # Extract text using pdfplumber
                text_content = ""
                with pdfplumber.open(temp_file_path) as pdf:
                    for page_num, page in enumerate(pdf.pages, 1):
                        try:
                            page_text = page.extract_text()
                            if page_text:
                                text_content += f"\n--- Page {page_num} ---\n"
                                text_content += page_text
                        except Exception as e:
                            logger.warning(f"Failed to extract text from page {page_num} of {filename}: {e}")
                            continue
                
                # Clean up the extracted text
                text_content = PDFProcessor._clean_text(text_content)
                
                if not text_content.strip():
                    raise ValueError("No text content could be extracted from the PDF")
                
                logger.info(f"Successfully extracted {len(text_content)} characters from {filename}")
                return text_content
                
            finally:
                # Clean up temporary file
                try:
                    os.unlink(temp_file_path)
                except Exception as e:
                    logger.warning(f"Failed to delete temporary file {temp_file_path}: {e}")
                    
        except Exception as e:
            logger.error(f"PDF text extraction failed for {filename}: {e}")
            raise ValueError(f"Failed to extract text from PDF: {str(e)}")
    
    @staticmethod
    def _clean_text(text: str) -> str:
        """Clean and normalize extracted text"""
        if not text:
            return ""
        
        # Remove excessive whitespace and normalize line breaks
        lines = []
        for line in text.split('\n'):
            cleaned_line = ' '.join(line.split())  # Remove extra spaces
            if cleaned_line:  # Skip empty lines
                lines.append(cleaned_line)
        
        # Join lines with single newlines
        cleaned_text = '\n'.join(lines)
        
        # Remove page separators we added
        cleaned_text = cleaned_text.replace('--- Page ', '\n--- Page ')
        
        return cleaned_text.strip()
    
    @staticmethod
    def validate_pdf_file(file_content: bytes, filename: str, max_size: int = 10 * 1024 * 1024) -> bool:
        """
        Validate PDF file
        Returns: True if valid, raises ValueError if invalid
        """
        # Check file size
        if len(file_content) > max_size:
            raise ValueError(f"File size exceeds maximum allowed size of {max_size // (1024*1024)}MB")
        
        # Check if file is empty
        if len(file_content) == 0:
            raise ValueError("File is empty")
        
        # Basic PDF header check
        if not file_content.startswith(b'%PDF-'):
            raise ValueError("File is not a valid PDF")
        
        # Check filename extension
        if not filename.lower().endswith('.pdf'):
            raise ValueError("File must have .pdf extension")
        
        return True
