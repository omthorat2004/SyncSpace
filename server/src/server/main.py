import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from src.server.core._settings import settings
from src.server.exceptions.base import AppException
from src.server.router.auth import router as auth_router
from src.server.router.space import router as space_router
from src.server.router.content import router as content_router

# Fetch the uvicorn error logger to use its handlers and formatters
logger = logging.getLogger("uvicorn.error")

# --- PERFECT LOGGING INTEGRATION START ---
# Configure your application's top-level namespace ("src")
app_logger = logging.getLogger("src")
app_logger.setLevel(logging.INFO)

# If Uvicorn has already initialized its stream handlers, pipe "src" logs into them
# This guarantees your logs match Uvicorn's formatting perfectly
if logger.handlers:
    app_logger.handlers = logger.handlers
    app_logger.propagate = False
# --- PERFECT LOGGING INTEGRATION END ---


def _normalize_api_prefix(prefix: str) -> str:
    normalized = (prefix or "/api/v1").strip()
    if not normalized.startswith("/"):
        normalized = f"/{normalized}"
    normalized = normalized.rstrip("/")
    return normalized or "/api/v1"


API_PREFIX = _normalize_api_prefix(settings.api_v1_prefix)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting SyncSpace API...")
    yield
    logger.info("Shutting down SyncSpace API...")

app = FastAPI(title="SyncSpace API", debug=settings.debug, lifespan=lifespan)

@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    logger.error(f"AppException: {exc.message}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": exc.message}
    )


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allow_origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix=API_PREFIX)
app.include_router(space_router, prefix=API_PREFIX)
app.include_router(content_router, prefix=API_PREFIX)

# Health check endpoint
@app.get("/health", tags=["health"])
async def health_check():
    return {"status": "ok"}