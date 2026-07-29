from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models
from ..schemas import FeedResponse, FeedItem

router = APIRouter()


@router.get("/", response_model=FeedResponse)
def get_feed(page: int = 1, page_size: int = 20, db: Session = Depends(get_db)):
    offset = (page - 1) * page_size
    videos = db.query(models.Video).filter(models.Video.is_active == True, models.Video.moderation_status == 'approved').order_by(models.Video.created_at.desc()).offset(offset).limit(page_size).all()

    return FeedResponse(
        results=[
            FeedItem(
                id=video.id,
                title=video.title,
                description=video.description,
                video_url=video.video_url,
                thumbnail_url=video.thumbnail_url,
                like_count=video.like_count,
                view_count=video.view_count,
                moderation_status=video.moderation_status,
            )
            for video in videos
        ],
        page=page,
        page_size=page_size,
    )
