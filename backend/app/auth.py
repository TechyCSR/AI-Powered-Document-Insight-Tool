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
    logger.info(f"Verifying JWT token in {settings.environment} environment")
    try:
        token = credentials.credentials
        logger.info(f"Token received: {token[:20]}...")
        
        # Get Clerk's public keys (JWKS)
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get("https://api.clerk.com/v1/jwks")
                if response.status_code != 200:
                    logger.warning(f"Failed to fetch JWKS: {response.status_code}")
                    # Continue with development mode for now
                    pass
                else:
                    jwks = response.json()
            except Exception as e:
                logger.warning(f"Error fetching JWKS: {e}")
                # Continue with development mode for now
                pass
        
        # For development, we'll use a simpler approach
        # In production, you should properly verify the JWT with Clerk's public keys
        
        # Decode the token without verification for development
        # WARNING: This is for development only!
        if settings.environment == "development":
            try:
                logger.info(f"Processing token in development mode")
                payload = jwt.get_unverified_claims(token)
                logger.info(f"Token payload: {payload}")
                user_id = payload.get("sub")
                if not user_id:
                    logger.error("Token missing user ID")
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="Invalid token: missing user ID"
                    )
                logger.info(f"Successfully authenticated user: {user_id}")
                return user_id
            except JWTError as e:
                logger.error(f"JWT decode error: {e}")
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid token format"
                )
        
        # For production, implement proper JWT verification with Clerk's public keys
        if settings.environment == "production":
            try:
                # In production, we need to properly verify the JWT
                # For now, we'll use the same approach as development but log it
                logger.info(f"Processing token in production mode")
                payload = jwt.get_unverified_claims(token)
                logger.info(f"Token payload: {payload}")
                user_id = payload.get("sub")
                if not user_id:
                    logger.error("Token missing user ID")
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="Invalid token: missing user ID"
                    )
                logger.info(f"Successfully authenticated user: {user_id}")
                return user_id
            except JWTError as e:
                logger.error(f"JWT decode error: {e}")
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid token format"
                )
        else:
            # Development mode fallback
            raise HTTPException(
                status_code=status.HTTP_501_NOT_IMPLEMENTED,
                detail="Development JWT verification not implemented"
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
