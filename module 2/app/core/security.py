from typing import Optional
from fastapi import HTTPException, Security, status
from fastapi.security import APIKeyHeader
from app.core.config import settings

API_KEY_HEADER = APIKeyHeader(name="X-API-Key", auto_error=False)


async def verify_api_key(api_key: Optional[str] = Security(API_KEY_HEADER)) -> Optional[str]:
    """
    Validate API key from request headers.
    If API_KEY_REQUIRED is False (default in dev/demo), allow requests.
    Otherwise verify against authorized API keys.
    """
    if not settings.API_KEY_REQUIRED:
        return api_key or "anonymous-dev-client"

    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing required X-API-Key header",
            headers={"WWW-Authenticate": "ApiKey"},
        )

    if api_key not in settings.API_KEYS:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid or unauthorized API key",
        )

    return api_key
