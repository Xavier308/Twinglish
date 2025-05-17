# app/routers/tweets.py
from fastapi import APIRouter, Depends, HTTPException, status, Query
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from pydantic import BaseModel

from app.simple_auth import get_current_user
from app.services.openai_service import correct_tweet

router = APIRouter()

# Define a simple tweet schema
class TweetBase(BaseModel):
    original_text: str
    
class TweetCreate(TweetBase):
    pass
    
class Tweet(TweetBase):
    id: int
    corrected_text: str
    explanation: str
    created_at: str
    user_id: int

# Sample tweets for testing
sample_tweets = []

@router.get("/", response_model=List[Tweet])
async def read_tweets(
    current_user: dict = Depends(get_current_user),
    skip: int = Query(0, ge=0, description="Number of tweets to skip (for pagination)"),
    limit: int = Query(10, ge=1, le=100, description="Number of tweets to return (page size)")
):
    """
    Get tweets for the current user with pagination support
    """
    # Filter tweets for current user
    user_tweets = [t for t in sample_tweets if t["user_id"] == current_user["id"]]
    
    # Sort tweets by created_at, newest first
    user_tweets.sort(key=lambda x: x["created_at"], reverse=True)
    
    # Apply pagination
    paginated_tweets = user_tweets[skip:skip + limit]
    
    return paginated_tweets

@router.post("/", response_model=Tweet)
async def create_tweet(tweet: Dict[str, Any], current_user: dict = Depends(get_current_user)):
    """
    Create a new tweet and correct it using OpenAI
    """
    # Get the original text from request
    original_text = tweet.get("original_text", "")
    
    if not original_text:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tweet text cannot be empty"
        )
    
    try:
        # Use OpenAI service to correct the text and get explanation
        corrected_text, explanation = await correct_tweet(original_text)
        
        # Create new tweet with the corrected text
        # Store in ISO 8601 format with UTC timezone explicitly marked
        new_id = max([t["id"] for t in sample_tweets], default=0) + 1
        new_tweet = {
            "id": new_id,
            "original_text": original_text,
            "corrected_text": corrected_text,
            "explanation": explanation,
            "created_at": datetime.now(timezone.utc).isoformat(),  # ISO 8601 format with Z for UTC
            "user_id": current_user["id"]
        }
        
        # Add to sample data
        sample_tweets.append(new_tweet)
        
        return new_tweet
    except Exception as e:
        print(f"Error creating tweet: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create tweet: {str(e)}"
        )

@router.get("/count", response_model=Dict[str, int])
async def get_tweet_count(current_user: dict = Depends(get_current_user)):
    """
    Get the count of tweets for the current user, useful for pagination
    """
    user_tweets = [t for t in sample_tweets if t["user_id"] == current_user["id"]]
    
    perfect_count = len([t for t in user_tweets if t["original_text"] == t["corrected_text"]])
    corrections_count = len(user_tweets) - perfect_count
    
    return {
        "total": len(user_tweets),
        "perfect": perfect_count,
        "corrections": corrections_count
    }
