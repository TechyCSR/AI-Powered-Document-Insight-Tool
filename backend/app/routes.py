from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from typing import List
from datetime import datetime
import logging

from app.auth import get_current_user_id
from app.database import get_database, INSIGHTS_COLLECTION
from app.models import AIProvider, InsightDocument, UploadResponse, InsightsResponse, ErrorResponse
from app.pdf_processor import PDFProcessor
from app.ai_providers import AIProviderService
from app.config import settings

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/upload-resume", response_model=UploadResponse)
async def upload_resume(
    file: UploadFile = File(...),
    provider: AIProvider = Form(AIProvider.SARVAM),
    user_id: str = Depends(get_current_user_id),
    db = Depends(get_database)
):
    """
    Upload and process a resume PDF file
    """
    try:
        # Validate file
        if not file.filename:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No file provided"
            )
        
        # Read file content
        file_content = await file.read()
        
        # Validate PDF file
        try:
            PDFProcessor.validate_pdf_file(file_content, file.filename, settings.max_file_size)
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )
        
        # Extract text from PDF
        try:
            extracted_text = await PDFProcessor.extract_text_from_pdf(file_content, file.filename)
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"PDF processing failed: {str(e)}"
            )
        
        # Get AI summary
        try:
            summary, is_fallback = await AIProviderService.get_summary(extracted_text, provider)
        except Exception as e:
            logger.error(f"AI processing failed: {e}")
            # Use fallback if AI completely fails
            summary = AIProviderService._get_fallback_summary(extracted_text)
            is_fallback = True
        
        # Create insight document
        insight_doc = InsightDocument(
            user_id=user_id,
            filename=file.filename,
            upload_date=datetime.utcnow(),
            provider=provider,
            summary=summary,
            is_fallback=is_fallback,
            file_size=len(file_content)
        )
        
        # Save to database
        try:
            collection = db[INSIGHTS_COLLECTION]
            result = await collection.insert_one(insight_doc.dict())
            logger.info(f"Saved insight document with ID: {result.inserted_id}")
        except Exception as e:
            logger.error(f"Database save failed: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to save document insights"
            )
        
        return UploadResponse(
            success=True,
            message="Resume processed successfully",
            summary=summary,
            provider=provider,
            is_fallback=is_fallback,
            filename=file.filename,
            upload_date=insight_doc.upload_date,
            document_id=str(result.inserted_id)
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in upload_resume: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while processing your request"
        )


@router.get("/insights", response_model=InsightsResponse)
async def get_insights(
    user_id: str = Depends(get_current_user_id),
    db = Depends(get_database)
):
    """
    Get all insights for the authenticated user
    """
    try:
        collection = db[INSIGHTS_COLLECTION]
        
        # Query documents for this user, sorted by upload date (newest first)
        cursor = collection.find({"user_id": user_id}).sort("upload_date", -1)
        documents = await cursor.to_list(length=None)
        
        # Convert to InsightDocument objects
        insights = []
        for doc in documents:
            # Convert MongoDB's _id to string id field
            doc["id"] = str(doc.pop("_id"))
            insights.append(InsightDocument(**doc))
        
        return InsightsResponse(
            success=True,
            insights=insights,
            total_count=len(insights)
        )
        
    except Exception as e:
        logger.error(f"Error retrieving insights for user {user_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve insights"
        )


@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}


@router.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "AI-Powered Document Insight Tool API",
        "version": "1.0.0",
        "docs": "/docs"
    }
