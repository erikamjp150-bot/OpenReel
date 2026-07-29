from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models
from ..schemas import VideoUploadResponse
from ..services.video_processor import VideoProcessor
from typing import Optional
from .auth import get_current_user

router = APIRouter()


def get_video_processor() -> VideoProcessor:
    return VideoProcessor()


@router.post("/upload", response_model=VideoUploadResponse)
async def upload_video(
    title: Optional[str] = None,
    description: Optional[str] = None,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
    processor: VideoProcessor = Depends(get_video_processor),
):
    if not file.content_type.startswith("video/"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid video file")

    temp_path = f"/tmp/{file.filename}"
    with open(temp_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)

    processed = processor.process_video(temp_path)

    video = models.Video(
        creator_id=user.id,
        title=title,
        description=description,
        video_url=processed["url"],
        thumbnail_url=processed["thumbnails"]["default"],
        duration=int(processed["metadata"]["duration"]),
        width=processed["metadata"]["width"],
        height=processed["metadata"]["height"],
        file_size=processed["metadata"]["file_size"],
        moderation_status="pending",
    )
    db.add(video)
    db.commit()
    db.refresh(video)
    return video
