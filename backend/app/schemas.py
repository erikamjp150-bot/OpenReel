from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr, ConfigDict


class Token(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    full_name: Optional[str] = None


class LoginRequest(BaseModel):
    username: str
    password: str


class RefreshRequest(BaseModel):
    refresh_token: str


class UserRead(BaseModel):
    id: int
    username: str
    email: EmailStr
    full_name: Optional[str] = None
    profile_picture_url: Optional[str] = None
    is_verified: bool

    model_config = ConfigDict(from_attributes=True)


class VideoUploadResponse(BaseModel):
    id: int
    title: Optional[str]
    description: Optional[str]
    video_url: str
    thumbnail_url: Optional[str]
    duration: Optional[int]
    width: Optional[int]
    height: Optional[int]
    file_size: Optional[int]
    moderation_status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class FeedItem(BaseModel):
    id: int
    title: Optional[str]
    description: Optional[str]
    video_url: str
    thumbnail_url: Optional[str]
    like_count: int
    view_count: int
    moderation_status: str

    model_config = ConfigDict(from_attributes=True)


class FeedResponse(BaseModel):
    results: List[FeedItem]
    page: int
    page_size: int


class InteractionCreate(BaseModel):
    video_id: int
    action: str
    value: Optional[float] = 1.0
