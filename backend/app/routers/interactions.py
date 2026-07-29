from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models
from ..schemas import InteractionCreate

router = APIRouter()


@router.post("/", status_code=status.HTTP_201_CREATED)
def record_interaction(interaction: InteractionCreate, db: Session = Depends(get_db)):
    video = db.query(models.Video).filter(models.Video.id == interaction.video_id).first()
    if not video:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Video not found")

    db_interaction = models.Interaction(
        user_id=1,
        video_id=interaction.video_id,
        action=interaction.action,
        value=interaction.value,
    )
    db.add(db_interaction)

    if interaction.action == 'view':
        video.view_count += int(interaction.value)
    elif interaction.action == 'like':
        video.like_count += 1

    db.commit()
    return {"status": "recorded", "video_id": interaction.video_id, "action": interaction.action}
