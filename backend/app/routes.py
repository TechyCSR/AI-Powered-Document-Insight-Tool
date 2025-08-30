from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from fastapi.responses import FileResponse, Response
from typing import List
from datetime import datetime
import logging
import os
import aiofiles
from bson import ObjectId

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
    logger.info(f"Upload request received for user {user_id}, provider: {provider}, filename: {file.filename}")
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
            file_size=len(file_content),
            has_preview=True  # New uploads always have preview
        )
        
        # Save to database first
        try:
            collection = db[INSIGHTS_COLLECTION]
            result = await collection.insert_one(insight_doc.dict())
            document_id = str(result.inserted_id)
            logger.info(f"Saved insight document with ID: {document_id}")
        except Exception as e:
            logger.error(f"Database save failed: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to save document insights"
            )
        
        # Save PDF both to disk (temporary) and to DB as GridFS-like binary
        try:
            # Create storage directory if it doesn't exist
            os.makedirs(settings.pdf_storage_dir, exist_ok=True)

            pdf_filename = f"{document_id}.pdf"
            pdf_storage_path = os.path.join(settings.pdf_storage_dir, pdf_filename)

            # Save to disk for immediate preview speed
            async with aiofiles.open(pdf_storage_path, 'wb') as f:
                await f.write(file_content)
            logger.info(f"Saved PDF file: {pdf_storage_path}")

            # Also store the binary in the document for long-term preview
            collection = db[INSIGHTS_COLLECTION]
            await collection.update_one({"_id": ObjectId(document_id)}, {
                "$set": {
                    "pdf_blob": file_content,
                    "has_preview": True,
                }
            })
            
            # Clean up local file after successful MongoDB storage
            try:
                if os.path.exists(pdf_storage_path):
                    os.remove(pdf_storage_path)
                    logger.info(f"Cleaned up local PDF file: {pdf_storage_path}")
            except Exception as cleanup_error:
                logger.warning(f"Failed to cleanup local PDF file {pdf_storage_path}: {cleanup_error}")
                
        except Exception as e:
            logger.warning(f"Failed to save PDF for preview: {e}")
            # Clean up local file even if MongoDB save fails
            try:
                if os.path.exists(pdf_storage_path):
                    os.remove(pdf_storage_path)
                    logger.info(f"Cleaned up local PDF file after DB save failure: {pdf_storage_path}")
            except Exception as cleanup_error:
                logger.warning(f"Failed to cleanup local PDF file after error: {cleanup_error}")
            # Continue even if file save fails - document is already in database
        
        return UploadResponse(
            success=True,
            message="Resume processed successfully",
            summary=summary,
            provider=provider,
            is_fallback=is_fallback,
            filename=file.filename,
            upload_date=insight_doc.upload_date,
            document_id=document_id
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
        
        # Convert to InsightDocument objects (exclude binary blobs)
        insights = []
        for doc in documents:
            # Convert MongoDB's _id to string id field
            doc["id"] = str(doc.pop("_id"))
            # Never send raw PDF bytes over this endpoint
            doc.pop("pdf_blob", None)
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


@router.get("/document/{document_id}/preview")
async def get_document_preview(
    document_id: str,
    user_id: str = Depends(get_current_user_id),
    db = Depends(get_database)
):
    """
    Get PDF file for preview - only for documents owned by the user
    """
    try:
        # Verify the document belongs to the user
        collection = db[INSIGHTS_COLLECTION]
        try:
            document = await collection.find_one({
                "_id": ObjectId(document_id),
                "user_id": user_id
            })
        except Exception:
            # Invalid ObjectId format
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid document ID format"
            )
        
        if not document:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Document not found or access denied"
            )
        
        # Check if PDF file exists on disk first (fast path)
        pdf_filename = f"{document_id}.pdf"
        pdf_path = os.path.join(settings.pdf_storage_dir, pdf_filename)
        
        if os.path.exists(pdf_path):
            # Return the PDF file from disk
            return FileResponse(
                path=pdf_path,
                media_type="application/pdf",
                filename=document.get("filename", "document.pdf")
            )

        # Fallback to DB-stored blob for older/cleaned files
        if document.get("pdf_blob"):
            return Response(content=document["pdf_blob"], media_type="application/pdf")

        # Last resort: not found
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="PDF file not found"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error serving document preview {document_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve document preview"
        )


@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

@router.post("/test-upload")
async def test_upload(
    file: UploadFile = File(...),
    provider: AIProvider = Form(AIProvider.SARVAM)
):
    """
    Test upload endpoint without authentication for debugging
    """
    logger.info(f"Test upload request received, provider: {provider}, filename: {file.filename}")
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
        
        return {
            "success": True,
            "message": "Test upload successful",
            "filename": file.filename,
            "file_size": len(file_content),
            "provider": provider
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in test_upload: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while processing your request"
        )


@router.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "AI-Powered Document Insight Tool API",
        "version": "1.0.0",
        "docs": "/docs"
    }
