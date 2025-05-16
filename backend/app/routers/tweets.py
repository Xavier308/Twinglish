# app/routers/tweets.py
from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime, timezone
from typing import List, Dict, Any
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
sample_tweets = [
    {
        "id": 1,
        "original_text": "I thinked about going to the store yesterday but I forgeted.",
        "corrected_text": "I thought about going to the store yesterday but I forgot.",
        "explanation": "The past tense of 'think' is 'thought', not 'thinked'. Similarly, the past tense of 'forget' is 'forgot', not 'forgeted'.",
        "created_at": datetime.now(timezone.utc).isoformat(), # Store in UTC
        "user_id": 1
    },
    {
        "id": 2,
        "original_text": "I have been studing english for 2 years and im getting better everyday.",
        "corrected_text": "I have been studying English for 2 years and I'm getting better every day.",
        "explanation": "The correct spelling is 'studying' (not 'studing'), 'English' should be capitalized, and 'everyday' should be two words ('every day') in this context.",
        "created_at": datetime.now().isoformat(),
        "user_id": 1
    }
]

@router.get("/", response_model=List[Tweet])
async def read_tweets(current_user: dict = Depends(get_current_user)):
    """
    Get all tweets for the current user
    """
    # Return sample data
    user_tweets = [t for t in sample_tweets if t["user_id"] == current_user["id"]]
    return user_tweets

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
