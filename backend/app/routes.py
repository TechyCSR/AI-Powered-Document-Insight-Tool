from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from fastapi.responses import FileResponse, Response
from typing import List
from datetime import datetime
import logging
import os
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
            logger.info(f"AI processing successful. Summary length: {len(summary)}")
        except Exception as e:
            logger.error(f"AI processing failed: {e}")
            # Use fallback if AI completely fails
            summary = AIProviderService._get_fallback_summary(extracted_text)
            is_fallback = True
            logger.info(f"Using fallback summary. Length: {len(summary)}")

        # Prepare response data immediately after AI processing
        upload_date = datetime.utcnow()
        response_data = UploadResponse(
            success=True,
            message="Resume processed successfully",
            summary=summary,
            provider=provider,
            is_fallback=is_fallback,
            filename=file.filename,
            upload_date=upload_date,
            document_id="temp"  # Will be updated if database save succeeds
        )

        # Try to save to database (non-blocking for response)
        document_id = None
        has_preview = False
        
        try:
            # Check if database is available
            if db is None:
                logger.warning("⚠️ Database connection not available, skipping save")
                response_data.message = "Resume processed successfully (history not saved - database unavailable)"
                return response_data
            
            # Create insight document
            insight_doc = InsightDocument(
                user_id=user_id,
                filename=file.filename,
                upload_date=upload_date,
                provider=provider,
                summary=summary,
                is_fallback=is_fallback,
                file_size=len(file_content),
                has_preview=False  # Start with False, will update if PDF save succeeds
            )
            
            # Save to database with proper async handling
            try:
                collection = db[INSIGHTS_COLLECTION]
                result = await collection.insert_one(insight_doc.dict())
                document_id = str(result.inserted_id)
                response_data.document_id = document_id
                logger.info(f"✅ Document saved to database with ID: {document_id}")
                
                # Try to save PDF binary (optional)
                try:
                    await collection.update_one({"_id": ObjectId(document_id)}, {
                        "$set": {
                            "pdf_blob": file_content,
                            "has_preview": True,
                        }
                    })
                    has_preview = True
                    logger.info(f"✅ PDF binary saved for document ID: {document_id}")
                except Exception as pdf_error:
                    logger.warning(f"⚠️ PDF binary save failed (non-critical): {pdf_error}")
                    # Update document to indicate no preview available
                    try:
                        await collection.update_one({"_id": ObjectId(document_id)}, {
                            "$set": {"has_preview": False}
                        })
                    except:
                        pass  # If this fails too, just continue
                        
            except RuntimeError as runtime_error:
                if "Event loop is closed" in str(runtime_error):
                    logger.error("❌ Event loop closed - serverless environment issue")
                    response_data.message = "Resume processed successfully (history not saved - server issue)"
                else:
                    raise runtime_error
            except Exception as db_save_error:
                logger.error(f"❌ Database insert failed: {db_save_error}")
                response_data.message = "Resume processed successfully (history not saved - database error)"
                    
        except Exception as db_error:
            logger.error(f"❌ Database save failed: {db_error}")
            logger.error(f"Database object type: {type(db)}")
            logger.error(f"Database value: {db}")
            # Don't fail the entire request - user still gets their summary
            response_data.message = "Resume processed successfully (history not saved)"
            
        return response_data
        
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
        # Check if database connection is available
        if db is None:
            logger.error("Database connection is None")
            return InsightsResponse(
                success=True,
                insights=[],
                total_count=0
            )
            
        collection = db[INSIGHTS_COLLECTION]
        
        # Query documents for this user, sorted by upload date (newest first)
        cursor = collection.find({"user_id": user_id}).sort("upload_date", -1)
        documents = await cursor.to_list(length=None)
        
        # Convert to InsightDocument objects (exclude binary blobs)
        insights = []
        for doc in documents:
            try:
                # Convert MongoDB's _id to string id field
                doc["id"] = str(doc.pop("_id"))
                # Never send raw PDF bytes over this endpoint
                doc.pop("pdf_blob", None)
                insights.append(InsightDocument(**doc))
            except Exception as doc_error:
                logger.warning(f"Error processing document: {doc_error}")
                continue
        
        return InsightsResponse(
            success=True,
            insights=insights,
            total_count=len(insights)
        )
        
    except Exception as e:
        logger.error(f"Error retrieving insights for user {user_id}: {e}")
        # Return empty list instead of error to prevent frontend crashes
        return InsightsResponse(
            success=True,
            insights=[],
            total_count=0
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
        
        # Check if PDF file exists on disk first (fast path) - Skip for production
        # In serverless environments, always use database storage
        
        # Get PDF content from database
        if document.get("pdf_blob"):
            return Response(content=document["pdf_blob"], media_type="application/pdf")

        # Not found - document exists but no PDF stored
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
async def health_check(db = Depends(get_database)):
    """Health check endpoint with database connectivity"""
    health_status = {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "environment": settings.environment,
        "database": {
            "connected": False,
            "status": "disconnected",
            "error": None
        }
    }
    
    # Check database connectivity
    try:
        if db is None:
            health_status["database"]["status"] = "connection_failed"
            health_status["database"]["error"] = "Database connection is None"
        else:
            # Try to ping the database
            await db.command("ping")
            health_status["database"]["connected"] = True
            health_status["database"]["status"] = "connected"
            
            # Try to count documents in insights collection
            collection = db[INSIGHTS_COLLECTION]
            doc_count = await collection.count_documents({})
            health_status["database"]["insights_count"] = doc_count
            
    except Exception as e:
        health_status["database"]["status"] = "error"
        health_status["database"]["error"] = str(e)
    
    return health_status


@router.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "AI-Powered Document Insight Tool API",
        "version": "1.0.0",
        "docs": "/docs"
    }
