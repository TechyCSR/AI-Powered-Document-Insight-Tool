from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
import httpx
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
        
        # Get Clerk's public keys (JWKS)
        async with httpx.AsyncClient() as client:
            response = await client.get("https://api.clerk.com/v1/jwks")
            if response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Unable to verify token"
                )
            
            jwks = response.json()
        
        # For development, we'll use a simpler approach
        # In production, you should properly verify the JWT with Clerk's public keys
        
        # Decode the token without verification for development
        # WARNING: This is for development only!
        if settings.environment == "development":
            try:
                payload = jwt.get_unverified_claims(token)
                user_id = payload.get("sub")
                if not user_id:
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="Invalid token: missing user ID"
                    )
                return user_id
            except JWTError:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid token format"
                )
        
        # For production, implement proper JWT verification with Clerk's public keys
        # This is a placeholder for proper implementation
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Production JWT verification not implemented"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"JWT verification error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token verification failed"
        )


async def get_current_user_id(user_id: str = Depends(verify_clerk_jwt)) -> str:
    """Get current authenticated user ID"""
    return user_id
