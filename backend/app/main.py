from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, videos, feed, interactions, admin
from .database import engine
from . import models
from .config import settings
import logging

# Create tables
models.Base.metadata.create_all(bind=engine)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="OpenReel API",
    description="An open-source, privacy-first alternative to TikTok",
    version="0.1.0"
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
app.include_router(auth.router, prefix="/auth", tags=["authentication"])
app.include_router(videos.router, prefix="/videos", tags=["videos"])
app.include_router(feed.router, prefix="/feed", tags=["feed"])
app.include_router(interactions.router, prefix="/interactions", tags=["interactions"])
app.include_router(admin.router, prefix="/admin", tags=["administration"])

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "openreel-backend"}
