from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class AIProvider(str, Enum):
    SARVAM = "sarvam"
    GEMINI = "gemini"


class InsightDocument(BaseModel):
    user_id: str = Field(..., description="Clerk user ID")
    filename: str = Field(..., description="Original filename")
    upload_date: datetime = Field(default_factory=datetime.utcnow)
    provider: AIProvider = Field(..., description="AI provider used")
    summary: str = Field(..., description="Generated summary or fallback keywords")
    is_fallback: bool = Field(default=False, description="Whether fallback was used")
    file_size: int = Field(..., description="File size in bytes")
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class UploadResponse(BaseModel):
    success: bool
    message: str
    summary: str
    provider: AIProvider
    is_fallback: bool
    filename: str
    upload_date: datetime


class InsightsResponse(BaseModel):
    success: bool
    insights: List[InsightDocument]
    total_count: int


class ErrorResponse(BaseModel):
    success: bool = False
    message: str
    error_code: Optional[str] = None
