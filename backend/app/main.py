# backend/app/main.py
from fastapi import FastAPI, HTTPException, Request, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
import json

# App setup
app = FastAPI(
    title="Twinglish API",
    description="Twitter-style application for language learning",
    version="0.1.0"
)

# CORS - allow requests from any origin (for development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TweetBase(BaseModel):
    original_text: str
    
class Tweet(TweetBase):
    id: int
    corrected_text: str
    explanation: str
    created_at: str
    user_id: int

# In-memory database
users = {
    "testuser": {
        "id": 1,
        "username": "testuser",
        "password": "Password123",
        "email": "test@example.com"
    }
}

tweets = [
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

# Error handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"Error: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": f"Server error: {str(exc)}"}
    )

# Token validation
def validate_token(token: str) -> dict:
    """Validate the token and return the user if valid."""
    print(f"Validating token: {token}")
    
    try:
        parts = token.split(':')
        if len(parts) != 3:
            print(f"Invalid token format: {token}")
            return None
            
        username, user_id, timestamp = parts
        user_id = int(user_id)
        
        user = users.get(username)
        if not user or user["id"] != user_id:
            print(f"User not found or ID mismatch: {username}, {user_id}")
            return None
            
        # For simplicity, we're not checking token expiration
        return user
    except Exception as e:
        print(f"Token validation error: {e}")
        return None

# Routes
@app.get("/")
def root():
    return {"message": "Welcome to Twinglish API"}

@app.post("/api/v1/auth/login")
def login(request: Dict[str, Any]):
    username = request.get("username")
    password = request.get("password")
    
    # Also handle form data
    if not username or not password:
        username = request.get("form", {}).get("username")
        password = request.get("form", {}).get("password")
    
    print(f"Login attempt: username={username}, password={'*' * len(password) if password else None}")
    
    # Check credentials
    user = users.get(username)
    if not user or user["password"] != password:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    # Generate token (very simple - not secure for production!)
    token = f"{username}:{user['id']}:{datetime.now().timestamp()}"
    print(f"Login successful. Token: {token}")
    
    return {"access_token": token, "token_type": "bearer"}

@app.get("/api/v1/tweets/")
def get_tweets(authorization: Optional[str] = Header(None), token: Optional[str] = Header(None)):
    """Get all tweets for the current user."""
    print("Headers received:")
    print(f"Authorization: {authorization}")
    print(f"Token: {token}")
    
    # Try to get token from Authorization header
    actual_token = None
    if authorization and authorization.startswith("Bearer "):
        actual_token = authorization.replace("Bearer ", "")
    elif token:
        actual_token = token
    
    if not actual_token:
        print("No token found in headers")
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    # Validate token
    user = validate_token(actual_token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    # Return tweets for this user
    user_tweets = [t for t in tweets if t["user_id"] == user["id"]]
    return user_tweets

@app.post("/api/v1/tweets/")
def create_tweet(tweet_data: Dict[str, Any], authorization: Optional[str] = Header(None), token: Optional[str] = Header(None)):
    """Create a new tweet."""
    # Try to get token from Authorization header
    actual_token = None
    if authorization and authorization.startswith("Bearer "):
        actual_token = authorization.replace("Bearer ", "")
    elif token:
        actual_token = token
    
    if not actual_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    # Validate token
    user = validate_token(actual_token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    # Create new tweet
    original_text = tweet_data.get("original_text", "")
    new_id = max([t["id"] for t in tweets]) + 1
    
    new_tweet = {
        "id": new_id,
        "original_text": original_text,
        "corrected_text": original_text,  # Simple echo for now
        "explanation": "This is where the explanation would go.",
        "created_at": datetime.now().isoformat(),
        "user_id": user["id"]
    }
    
    tweets.append(new_tweet)
    return new_tweet

# Extra endpoint to debug token issues
@app.get("/api/v1/debug-token")
def debug_token(authorization: Optional[str] = Header(None), token: Optional[str] = Header(None)):
    """Debug endpoint to check token validation."""
    headers = {
        "authorization": authorization,
        "token": token
    }
    
    # Try to get token from Authorization header
    actual_token = None
    if authorization and authorization.startswith("Bearer "):
        actual_token = authorization.replace("Bearer ", "")
    elif token:
        actual_token = token
    
    response = {
        "headers_received": headers,
        "token_extracted": actual_token,
    }
    
    if actual_token:
        # Validate token
        user = validate_token(actual_token)
        response["token_valid"] = user is not None
        response["user"] = user
    else:
        response["token_valid"] = False
    
    return response