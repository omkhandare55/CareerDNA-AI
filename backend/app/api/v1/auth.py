"""
CareerDNA AI – Authentication Endpoints
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/auth/me
"""

import uuid
import logging
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status

from app.core.config import get_settings
from app.core.database import get_demo_store
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
)
from app.models.schemas import (
    RegisterRequest,
    LoginRequest,
    TokenResponse,
    UserProfile,
    MessageResponse,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])
settings = get_settings()
logger = logging.getLogger("careerdna.auth")


def _to_user_profile(user: dict) -> UserProfile:
    created = user.get("created_at")
    if isinstance(created, str):
        try:
            created = datetime.fromisoformat(created)
        except Exception:
            created = None
    return UserProfile(
        user_id=str(user["id"]),
        email=user["email"],
        full_name=user.get("full_name", ""),
        current_title=user.get("current_title", ""),
        target_role=user.get("target_role", ""),
        created_at=created,
    )


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(body: RegisterRequest):
    """Create a new user account and return an access token."""
    store = get_demo_store()

    # Check email uniqueness
    existing = store.find_one("users", email=body.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )

    now = datetime.now(timezone.utc)
    user_id = str(uuid.uuid4())

    user = store.insert("users", {
        "id": user_id,
        "email": body.email,
        "full_name": body.full_name or "",
        "password_hash": hash_password(body.password),
        "current_title": body.current_title or "",
        "target_role": body.target_role or "",
        "is_active": True,
        "created_at": now,
        "updated_at": now,
    })

    # Seed demo data for new users so the dashboard looks populated
    try:
        store.seed_demo_data(user_id)
    except Exception as e:
        logger.warning(f"Seed demo data note for user {user_id}: {e}")

    token = create_access_token({
        "sub": user_id,
        "email": body.email,
        "full_name": body.full_name,
    })

    logger.info(f"New user registered: {body.email}")
    return TokenResponse(
        access_token=token,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=_to_user_profile(user),
    )


@router.post("/login", response_model=TokenResponse)
async def login(body: LoginRequest):
    """Authenticate a user and return an access token."""
    store = get_demo_store()
    user = store.find_one("users", email=body.email)

    if not user or not verify_password(body.password, user.get("password_hash", "")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    token = create_access_token({
        "sub": str(user["id"]),
        "email": user["email"],
        "full_name": user.get("full_name", ""),
    })

    logger.info(f"User logged in: {body.email}")
    return TokenResponse(
        access_token=token,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=_to_user_profile(user),
    )


@router.get("/me", response_model=UserProfile)
async def get_me(current_user: dict = Depends(get_current_user)):
    """Return the currently authenticated user's profile."""
    store = get_demo_store()
    user = store.get_by_id("users", current_user["user_id"])
    if not user:
        # Fallback profile if user was created in previous session
        return UserProfile(
            user_id=current_user["user_id"],
            email=current_user.get("email", "user@careerdna.ai"),
            full_name=current_user.get("full_name", "CareerDNA User"),
            target_role="Senior AI Engineer"
        )
    return _to_user_profile(user)
