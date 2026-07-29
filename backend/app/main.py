from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, videos, feed, interactions, admin
from .database import engine
from . import models
from .config import settings
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
def lifespan(app: FastAPI):
    models.Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="OpenReel API",
    description="An open-source, privacy-first alternative to TikTok",
    version="0.1.0",
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth, prefix="/auth", tags=["authentication"])
app.include_router(videos, prefix="/videos", tags=["videos"])
app.include_router(feed, prefix="/feed", tags=["feed"])
app.include_router(interactions, prefix="/interactions", tags=["interactions"])
app.include_router(admin, prefix="/admin", tags=["administration"])


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "openreel-backend"}
