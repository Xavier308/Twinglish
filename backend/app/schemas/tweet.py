# app/schemas/tweet.py
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class TweetBase(BaseModel):
    original_text: str = Field(..., max_length=280)


class TweetCreate(TweetBase):
    pass


class TweetUpdate(TweetBase):
    corrected_text: Optional[str] = Field(None, max_length=280)
    explanation: Optional[str] = None


class TweetInDBBase(TweetBase):
    id: int
    user_id: int
    created_at: datetime
    corrected_text: Optional[str] = None
    explanation: Optional[str] = None

    class Config:
        from_attributes = True


class Tweet(TweetInDBBase):
    pass