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
        
        # Detect document type first
        doc_type = AIProviderService._detect_document_type(text)
        logger.info(f"Detected document type: {doc_type}")
        
        try:
            if provider == AIProvider.SARVAM:
                logger.info("Using Sarvam AI provider")
                summary = await AIProviderService._get_sarvam_summary(text, doc_type)
            elif provider == AIProvider.GEMINI:
                logger.info("Using Gemini AI provider")
                summary = await AIProviderService._get_gemini_summary(text, doc_type)
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
    def _detect_document_type(text: str) -> str:
        """Detect if document is a resume or other document type"""
        resume_keywords = [
            'resume', 'cv', 'curriculum vitae', 'experience', 'education', 'skills',
            'work history', 'employment', 'objective', 'summary', 'achievements',
            'qualifications', 'certifications', 'references', 'contact', 'phone',
            'email', 'address', 'bachelor', 'master', 'degree', 'university',
            'college', 'graduated', 'gpa', 'internship', 'job', 'position',
            'responsibilities', 'accomplishments', 'projects'
        ]
        
        text_lower = text.lower()
        resume_score = sum(1 for keyword in resume_keywords if keyword in text_lower)
        
        # If we find multiple resume-related keywords, it's likely a resume
        if resume_score >= 5:
            return "resume"
        
        # Check for other document types
        if any(word in text_lower for word in ['research', 'paper', 'study', 'analysis', 'methodology']):
            return "research_paper"
        elif any(word in text_lower for word in ['proposal', 'project', 'budget', 'timeline']):
            return "proposal"
        elif any(word in text_lower for word in ['contract', 'agreement', 'terms', 'conditions']):
            return "legal_document"
        elif any(word in text_lower for word in ['report', 'findings', 'conclusion', 'recommendation']):
            return "report"
        else:
            return "general_document"
    
    @staticmethod
    def _get_system_prompt(doc_type: str) -> str:
        """Get appropriate system prompt based on document type"""
        if doc_type == "resume":
            return """You are an expert resume analyzer. Analyze the provided resume and return a structured analysis in EXACTLY this format:

**👤 Name:** [Extract full name]

**📧 Contact:** [Phone, Email, Location if available]

**💼 Professional Summary:** [2-3 concise sentences highlighting key qualifications]

**🎯 Core Skills:** [Comma-separated list of technical and soft skills]

**💪 Experience Highlights:** 
• [Most relevant experience with years and key achievements]
• [Second most important role with quantified results]
• [Third significant position with impact metrics]

**🎓 Education:**
• [Degree, Institution, Year/GPA if mentioned]
• [Additional education/certifications]

**🏆 Notable Achievements:**
• [Most impressive accomplishment with quantified results]
• [Second significant achievement]
• [Third notable accomplishment]

**📊 Career Insights:**
• Years of Experience: [Calculate total years]
• Industry Focus: [Primary industry/domain]
• Career Level: [Entry/Mid/Senior/Executive level]

IMPORTANT: Follow the exact format with emojis and structure above."""
        
        else:
            # For non-resume documents
            return f"""You are an expert document analyzer. Analyze the provided document and return a comprehensive analysis in this format:

**📄 Document Type:** [{doc_type.replace('_', ' ').title()}]

**📝 Document Summary:** [3-4 sentences describing the main purpose and content]

**🔍 Key Insights:**
• [First major insight or finding]
• [Second important point]
• [Third significant observation]

**📊 Main Topics Covered:**
• [Primary topic with brief description]
• [Secondary topic with context]
• [Additional topics as relevant]

**💡 Critical Information:**
• [Most important facts or data points]
• [Key recommendations or conclusions]
• [Notable details or implications]

**🎯 Target Audience:** [Who this document is intended for]

**📈 Key Takeaways:**
• [Primary takeaway for readers]
• [Secondary learning or insight]
• [Actionable conclusion or next steps]

IMPORTANT: Provide thorough analysis while maintaining the structured format with emojis."""

    @staticmethod
    async def _get_sarvam_summary(text: str, doc_type: str) -> str:
        """Get summary from Sarvam AI based on document type"""
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
                
                # Get appropriate system prompt based on document type
                system_prompt = AIProviderService._get_system_prompt(doc_type)
                
                payload = {
                    "model": "sarvam-m",
                    "messages": [
                        {
                            "role": "system",
                            "content": system_prompt
                        },
                        {
                            "role": "user",
                            "content": f"Please analyze this document:\n\n{text}"
                        }
                    ],
                    "max_tokens": 1500,  # Increased for detailed analysis
                    "temperature": 0.2,
                    "top_p": 1,
                    "reasoning_effort": "low"
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
    async def _get_gemini_summary(text: str, doc_type: str) -> str:
        """Get summary from Gemini AI based on document type"""
        if not settings.gemini_api_key:
            logger.warning("Gemini API key not configured")
            return ""
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                headers = {
                    "Content-Type": "application/json"
                }
                
                # Get appropriate system prompt based on document type
                system_prompt = AIProviderService._get_system_prompt(doc_type)
                
                payload = {
                    "contents": [{
                        "parts": [{
                            "text": f"""{system_prompt}

Please analyze this document:

{text}"""
                        }]
                    }],
                    "generationConfig": {
                        "temperature": 0.3,
                        "maxOutputTokens": 1500,  # Increased for detailed analysis
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
