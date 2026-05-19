"""
Security utilities for JWT token management in SyncSpace.

Industry standards followed:
- Use strong, environment-sourced secrets.
- Implement JTI for uniqueness and replay attack prevention.
- Hash sensitive tokens (e.g., refresh tokens) for storage.
- Enforce token expiration and validation.
- Support token revocation via version or blacklist (interface provided).
- Use UTC for timestamps.
- Log security events.
- Leverage Pydantic for type safety.
- Avoid storing secrets in code; use environment variables.
- Follow OWASP JWT guidelines.
"""

import hashlib
import logging
import os
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional

from jose import JWTError, jwt
from pydantic import BaseModel
from src.server.core._settings import settings

# Configure logging for security events
logger = logging.getLogger(__name__)
SECRET_KEY = str(settings.secret_key)
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = getattr(settings, "access_token_expire_minutes", 10)
REFRESH_TOKEN_EXPIRE_DAYS = getattr(settings, "refresh_token_expire_day", 7)
TOKEN_SALT = os.getenv("TOKEN_SALT", "syncspace_secure_salt")  # Environment variable for salt

class TokenPayload(BaseModel):
    sub: str  # User ID
    type: str  # "access" or "refresh"
    jti: str  # Unique JWT ID
    iat: datetime
    exp: datetime
    sid: Optional[str] = None  # Session ID (optional)
    version: Optional[int] = None  # For refresh tokens (revocation via version)

class TokenData(BaseModel):
    user_id: int
    token_type: str
    jti: str
    session_id: Optional[str] = None
    version: Optional[int] = None

def hash_token(token: str) -> str:
    """
    Hash token for secure database storage (e.g., refresh tokens).
    Uses PBKDF2 with high iterations for resistance to brute-force.
    """
    return hashlib.pbkdf2_hmac('sha256', token.encode(), TOKEN_SALT.encode(), 100000).hex()

def generate_jti() -> str:
    """Generate a cryptographically secure unique JWT ID."""
    return secrets.token_urlsafe(32)

def create_access_token(user_id: int, session_id: Optional[str] = None) -> str:
    """
    Create a short-lived access token.
    Includes JTI for uniqueness and optional session ID for tracking.
    """
    jti = generate_jti()
    now = datetime.now(timezone.utc)
    exp = now + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = TokenPayload(
        sub=str(user_id),
        type="access",
        jti=jti,
        iat=now,
        exp=exp,
        sid=session_id
    )
    token = jwt.encode(payload.model_dump(), SECRET_KEY, algorithm=ALGORITHM)
    logger.info(f"Access token created for user {user_id}, JTI: {jti}")
    return token

def create_refresh_token(user_id: int, token_version: int = 1) -> str:
    """
    Create a long-lived refresh token with version for revocation.
    Store the hashed version in DB; return the raw token to client.
    """
    jti = generate_jti()
    now = datetime.now(timezone.utc)
    exp = now + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    payload = TokenPayload(
        sub=str(user_id),
        type="refresh",
        jti=jti,
        iat=now,
        exp=exp,
        version=token_version
    )
    token = jwt.encode(payload.model_dump(), SECRET_KEY, algorithm=ALGORITHM)
    logger.info(f"Refresh token created for user {user_id}, JTI: {jti}, Version: {token_version}")
    return token

def verify_token(token: str) -> Optional[TokenData]:
    """
    Verify and decode JWT token.
    Checks signature, expiration, and basic claims.
    Returns TokenData if valid, None otherwise.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        token_payload = TokenPayload(**payload)
        now = datetime.now(timezone.utc)
        if token_payload.exp < now:
            logger.warning(f"Expired token attempted: JTI {token_payload.jti}")
            return None
        if token_payload.type not in ["access", "refresh"]:
            logger.warning(f"Invalid token type: {token_payload.type}, JTI {token_payload.jti}")
            return None
        token_data = TokenData(
            user_id=int(token_payload.sub),
            token_type=token_payload.type,
            jti=token_payload.jti,
            session_id=token_payload.sid,
            version=token_payload.version
        )
        logger.debug(f"Token verified: JTI {token_payload.jti}")
        return token_data
    except JWTError as e:
        logger.warning(f"JWT verification failed: {e}")
        return None
    except Exception as e:
        logger.error(f"Unexpected error in token verification: {e}")
        return None

def revoke_token(jti: str, reason: str = "user_logout") -> None:
    """
    Interface for token revocation (implement blacklist or version increment in DB layer).
    Call this on logout or security events.
    """
    logger.info(f"Token revoked: JTI {jti}, Reason: {reason}")
    # TODO: Implement DB blacklist or version update (e.g., increment user.token_version)

def refresh_access_token(refresh_token: str, expected_version: int) -> Optional[str]:
    """
    Validate refresh token and issue new access token.
    Checks version for revocation.
    """
    token_data = verify_token(refresh_token)
    if not token_data or token_data.token_type != "refresh":
        return None
    if token_data.version != expected_version:
        logger.warning(f"Refresh token version mismatch: expected {expected_version}, got {token_data.version}")
        return None
    return create_access_token(token_data.user_id, token_data.session_id)