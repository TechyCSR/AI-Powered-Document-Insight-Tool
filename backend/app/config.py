import os
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # MongoDB Configuration
    mongodb_uri: str = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
    database_name: str = "document_insights"
    
    # Clerk Configuration
    clerk_secret_key: str = os.getenv("CLERK_SECRET_KEY", "")
    
    # AI API Keys
    sarvam_api_key: str = os.getenv("SARVAM_API_KEY", "")
    gemini_api_key: str = os.getenv("GEMINI_API_KEY", "")
    
    # Application Settings
    environment: str = os.getenv("ENVIRONMENT", "development")
    debug: bool = os.getenv("DEBUG", "True").lower() == "true"
    allowed_origins: str = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173")
    
    @property
    def origins_list(self) -> List[str]:
        """Convert allowed_origins string to list"""
        return [origin.strip() for origin in self.allowed_origins.split(",")]
    
    # Upload Settings
    max_file_size: int = 10 * 1024 * 1024  # 10MB
    allowed_file_types: List[str] = ["application/pdf"]
    upload_dir: str = "uploads"
    pdf_storage_dir: str = "stored_pdfs"
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
