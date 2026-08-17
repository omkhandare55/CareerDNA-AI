"""
CareerDNA AI – FastAPI Application Entry Point
"""

import logging
import time
from contextlib import asynccontextmanager
from typing import Any

import orjson
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response

from app.api.v1.router import api_router
from app.core.config import get_settings
from app.core.database import init_db, close_db

# ──────────────────────────────────────────────────────────────────────────────
# Logging Setup
# ──────────────────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)
logger = logging.getLogger("careerdna")
settings = get_settings()


# ──────────────────────────────────────────────────────────────────────────────
# Lifespan (startup / shutdown)
# ──────────────────────────────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"🚀 Starting {settings.APP_NAME} backend [{settings.APP_ENV}]")
    await init_db()
    yield
    await close_db()
    logger.info("🛑 Backend shut down cleanly.")


# ──────────────────────────────────────────────────────────────────────────────
# App Factory
# ──────────────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="CareerDNA AI API",
    description=(
        "Lifelong AI Career Agent API — persistent memory, "
        "evolving recommendations, and real-time career intelligence."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# ──────────────────────────────────────────────────────────────────────────────
# CORS Middleware
# ──────────────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Request-ID"],
)


# ──────────────────────────────────────────────────────────────────────────────
# Request Timing Middleware
# ──────────────────────────────────────────────────────────────────────────────
@app.middleware("http")
async def timing_middleware(request: Request, call_next):
    start = time.perf_counter()
    response = await call_next(request)
    elapsed_ms = round((time.perf_counter() - start) * 1000, 2)
    response.headers["X-Response-Time-Ms"] = str(elapsed_ms)
    if request.url.path not in ("/health", "/"):
        logger.info(f"{request.method} {request.url.path} → {response.status_code} [{elapsed_ms}ms]")
    return response


# ──────────────────────────────────────────────────────────────────────────────
# Global Exception Handler
# ──────────────────────────────────────────────────────────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.exception(f"Unhandled error on {request.method} {request.url.path}: {exc}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An unexpected error occurred. Please try again."},
    )


# ──────────────────────────────────────────────────────────────────────────────
# Health & Root
# ──────────────────────────────────────────────────────────────────────────────
@app.get("/", tags=["Root"])
async def root():
    return {
        "service": settings.APP_NAME,
        "version": "1.0.0",
        "status": "online",
        "environment": settings.APP_ENV,
        "docs": "/docs",
        "mode": {
            "demo_db": settings.USE_DEMO_DB,
            "mock_ai": settings.USE_MOCK_AI,
            "has_aws": settings.has_aws_credentials,
        },
    }


@app.get("/health", tags=["Root"])
async def health():
    return {"status": "healthy", "timestamp": time.time()}


# ──────────────────────────────────────────────────────────────────────────────
# Mount All Routers
# ──────────────────────────────────────────────────────────────────────────────
app.include_router(api_router)


# ──────────────────────────────────────────────────────────────────────────────
# Dev Server Entry Point
# ──────────────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info",
    )
