from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models

router = APIRouter()


@router.get("/videos/pending")
def pending_videos(db: Session = Depends(get_db)):
    videos = db.query(models.Video).filter(models.Video.moderation_status == 'pending').all()
    return [
        {
            "id": video.id,
            "title": video.title,
            "description": video.description,
            "video_url": video.video_url,
            "thumbnail_url": video.thumbnail_url,
            "created_at": video.created_at,
        }
        for video in videos
    ]


@router.post("/videos/{video_id}/approve")
def approve_video(video_id: int, db: Session = Depends(get_db)):
    video = db.query(models.Video).filter(models.Video.id == video_id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    video.moderation_status = 'approved'
    db.commit()
    return {"status": "approved", "video_id": video_id}


@router.post("/videos/{video_id}/reject")
def reject_video(video_id: int, db: Session = Depends(get_db)):
    video = db.query(models.Video).filter(models.Video.id == video_id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    video.moderation_status = 'rejected'
    db.commit()
    return {"status": "rejected", "video_id": video_id}
