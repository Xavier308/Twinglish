# app/routers/tweets.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.db.session import get_db
from app.models.tweet import Tweet
from app.models.user import User
from app.schemas.tweet import Tweet as TweetSchema, TweetCreate
from app.services.auth import get_current_user

router = APIRouter()

@router.post("/", response_model=TweetSchema)
async def create_tweet(
    tweet_in: TweetCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Tweet:
    """
    Create a new tweet
    """
    # TODO: Implement OpenAI integration for correction
    
    db_tweet = Tweet(
        original_text=tweet_in.original_text,
        corrected_text=tweet_in.original_text,  # Placeholder until OpenAI integration
        explanation="Correction coming soon!",   # Placeholder until OpenAI integration
        user_id=current_user.id
    )
    
    db.add(db_tweet)
    await db.commit()
    await db.refresh(db_tweet)
    
    return db_tweet

@router.get("/", response_model=List[TweetSchema])
async def read_tweets(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> List[Tweet]:
    """
    Get user's tweets
    """
    result = await db.execute(
        select(Tweet)
        .where(Tweet.user_id == current_user.id)
        .order_by(Tweet.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    tweets = result.scalars().all()
    return tweets
