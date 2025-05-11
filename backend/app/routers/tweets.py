# app/routers/tweets.py
from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime
from typing import List, Dict, Any
from pydantic import BaseModel

from app.simple_auth import get_current_user

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
        "created_at": datetime.now().isoformat(),
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
    return sample_tweets

@router.post("/", response_model=Tweet)
async def create_tweet(tweet: Dict[str, Any], current_user: dict = Depends(get_current_user)):
    """
    Create a new tweet
    """
    # Get the original text from request
    original_text = tweet.get("original_text", "")
    
    # Create a simple correction
    new_tweet = {
        "id": len(sample_tweets) + 1,
        "original_text": original_text,
        "corrected_text": original_text,  # Just echo it back for now
        "explanation": "This is where the AI explanation would go.",
        "created_at": datetime.now().isoformat(),
        "user_id": current_user["id"]
    }
    
    # Add to our sample data
    sample_tweets.append(new_tweet)
    
    return new_tweet
