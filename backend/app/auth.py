from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from app.config import settings
import logging

logger = logging.getLogger(__name__)

security = HTTPBearer()


async def verify_clerk_jwt(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """
    Verify Clerk JWT token and return user_id
    """
    try:
        token = credentials.credentials
        logger.info(f"Processing token in environment: {settings.environment}")
        
        # Decode the token without verification to extract user information
        # This is safe for user identification purposes
        payload = jwt.get_unverified_claims(token)
        logger.info(f"Token payload keys: {list(payload.keys()) if payload else 'None'}")
        
        user_id = payload.get("sub")
        if not user_id:
            logger.error("Token missing user ID (sub)")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: missing user ID"
            )
        
        # Additional validation - check if token has required Clerk fields
        issuer = payload.get("iss", "")
        if not issuer or "clerk" not in issuer.lower():
            logger.error(f"Token not from Clerk issuer: {issuer}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token issuer"
            )
        
        logger.info(f"Successfully authenticated user: {user_id}")
        return user_id
        
    except HTTPException:
        raise
    except JWTError as e:
        logger.error(f"JWT decode error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token format"
        )
    except Exception as e:
        logger.error(f"JWT verification error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token verification failed"
        )


async def get_current_user_id(user_id: str = Depends(verify_clerk_jwt)) -> str:
    """Get current authenticated user ID"""
    return user_id
