import httpx
import re
from collections import Counter
from typing import Dict, List, Tuple
from app.config import settings
from app.models import AIProvider
import logging

logger = logging.getLogger(__name__)


class AIProviderService:
    """Service for handling different AI providers and fallback"""
    
    @staticmethod
    async def get_summary(text: str, provider: AIProvider) -> Tuple[str, bool]:
        """
        Get summary from specified AI provider with fallback
        Returns: (summary, is_fallback)
        """
        logger.info(f"Starting AI analysis with provider: {provider}")
        try:
            if provider == AIProvider.SARVAM:
                logger.info("Using Sarvam AI provider")
                summary = await AIProviderService._get_sarvam_summary(text)
            elif provider == AIProvider.GEMINI:
                logger.info("Using Gemini AI provider")
                summary = await AIProviderService._get_gemini_summary(text)
            else:
                raise ValueError(f"Unknown provider: {provider}")
            
            if summary:
                logger.info(f"AI analysis successful with {provider}")
                return summary, False
            else:
                logger.warning(f"AI analysis failed with {provider}, using fallback")
                # If AI fails, use fallback
                return AIProviderService._get_fallback_summary(text), True
                
        except Exception as e:
            logger.error(f"AI provider {provider} failed: {e}")
            return AIProviderService._get_fallback_summary(text), True
    
    @staticmethod
    async def _get_sarvam_summary(text: str) -> str:
        """Get summary from Sarvam AI"""
        if not settings.sarvam_api_key:
            logger.warning("Sarvam API key not configured")
            return ""
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                # Sarvam API endpoint (adjust based on actual API documentation)
                headers = {
                    "Authorization": f"Bearer {settings.sarvam_api_key}",
                    "Content-Type": "application/json"
                }
                
                payload = {
                    "model": "sarvam-m",
                    "messages": [
                        {
                            "role": "system",
                            "content": """You are an expert resume analyzer. Analyze the provided resume and return a structured analysis in EXACTLY this format:

**Professional Summary:** [2-3 concise sentences highlighting key qualifications]

**Key Skills:** [Comma-separated list of technical and soft skills]

**Experience Highlights:** [2-3 bullet points of most relevant experience]

**Education:** [Degree, institution, GPA if mentioned]

**Notable Achievements:** [2-3 most impressive accomplishments]

CRITICAL INSTRUCTIONS:
- NEVER include <think> tags or internal reasoning
- NEVER show your thinking process
- NEVER include phrases like "Okay, let's tackle this" or "Wait, the user said"
- ONLY return the final structured analysis starting with "**Professional Summary:**"
- Use EXACTLY the format above with no additional text before or after
- Keep responses professional and business-focused
- Quantify achievements where possible
- Focus on business value and impact

IMPORTANT: Your response must start with "**Professional Summary:**" and contain only the structured analysis."""
                        },
                        {
                            "role": "user",
                            "content": f"Please analyze this resume and provide a structured analysis:\n\n{text}"  # Send complete text
                        }
                    ],
                    "max_tokens": 1000,
                    "temperature": 0.2,  # For consistent, focused output
                    "top_p": 1,
                    "reasoning_effort": "low"  # Minimize verbose thinking process
                }
                
                # Correct Sarvam API endpoint
                response = await client.post(
                    "https://api.sarvam.ai/v1/chat/completions",
                    headers=headers,
                    json=payload
                )
                
                if response.status_code == 200:
                    result = response.json()
                    content = result.get("choices", [{}])[0].get("message", {}).get("content", "").strip()
                    logger.info(f"Sarvam AI analysis successful: {len(content)} characters")
                    
                    return content
                else:
                    logger.error(f"Sarvam API error: {response.status_code} - {response.text}")
                    return ""
                    
        except Exception as e:
            logger.error(f"Sarvam API request failed: {e}")
            return ""
    
    @staticmethod
    async def _get_gemini_summary(text: str) -> str:
        """Get summary from Gemini AI"""
        if not settings.gemini_api_key:
            logger.warning("Gemini API key not configured")
            return ""
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                headers = {
                    "Content-Type": "application/json"
                }
                
                payload = {
                    "contents": [{
                        "parts": [{
                            "text": f"""You are an expert resume analyzer. Analyze the provided resume and return a structured analysis in EXACTLY this format:

**Professional Summary:** [2-3 concise sentences highlighting key qualifications]

**Key Skills:** [Comma-separated list of technical and soft skills]

**Experience Highlights:** [2-3 bullet points of most relevant experience]

**Education:** [Degree, institution, GPA if mentioned]

**Notable Achievements:** [2-3 most impressive accomplishments]

IMPORTANT: 
- Follow the exact format above
- Keep responses professional and business-focused
- Quantify achievements where possible
- Focus on business value and impact

Please analyze this resume and provide a structured analysis:

{text}"""
                        }]
                    }],
                    "generationConfig": {
                        "temperature": 0.3,
                        "maxOutputTokens": 1000,  # Increased for structured output
                        "topP": 0.8,
                        "topK": 10
                    }
                }
                
                response = await client.post(
                    f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key={settings.gemini_api_key}",
                    headers=headers,
                    json=payload
                )
                
                if response.status_code == 200:
                    result = response.json()
                    candidates = result.get("candidates", [])
                    if candidates and candidates[0].get("content", {}).get("parts"):
                        content = candidates[0]["content"]["parts"][0].get("text", "").strip()
                        logger.info(f"Gemini AI analysis successful: {len(content)} characters")
                        
                        return content
                else:
                    logger.error(f"Gemini API error: {response.status_code} - {response.text}")
                    return ""
                    
        except Exception as e:
            logger.error(f"Gemini API request failed: {e}")
            return ""
    

    
    @staticmethod
    def _get_fallback_summary(text: str) -> str:
        """Generate fallback summary using structured format"""
        try:
            # Clean and tokenize text
            words = re.findall(r'\b[a-zA-Z]{3,}\b', text.lower())
            
            # Common stop words to filter out
            stop_words = {
                'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use'
            }
            
            # Filter out stop words and common resume words that aren't meaningful
            filtered_words = [
                word for word in words 
                if word not in stop_words and len(word) > 3
            ]
            
            # Get top 8 most frequent words for skills
            word_counts = Counter(filtered_words)
            top_skills = [word for word, count in word_counts.most_common(8)]
            
            # Extract education info (look for common degree patterns)
            education_keywords = ['bachelor', 'master', 'phd', 'degree', 'university', 'college', 'gpa', 'cgpa']
            education_info = "Education details extracted from document"
            
            # Extract experience info
            experience_keywords = ['experience', 'years', 'worked', 'developed', 'managed', 'led']
            experience_info = "Work experience details available in document"
            
            # Format in structured way
            skills_text = ", ".join(top_skills) if top_skills else "Technical skills extracted from document"
            
            return f"""**Professional Summary:**  
Document processed successfully. AI analysis unavailable - using keyword extraction.

**Key Skills:**  
{skills_text}

**Experience Highlights:**  
• {experience_info}

**Education:**  
{education_info}

**Notable Achievements:**  
• Document contains achievement information (AI analysis unavailable)"""
                
        except Exception as e:
            logger.error(f"Fallback summary generation failed: {e}")
            return """**Professional Summary:**  
Document processed successfully. Analysis unavailable.

**Key Skills:**  
Unable to extract skills

**Experience Highlights:**  
• Information available in document

**Education:**  
• Details in document

**Notable Achievements:**  
• Information available in document"""
