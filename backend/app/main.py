# backend/app/main.py
from fastapi import FastAPI, Request, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import Optional

from app.core.config import settings
from app.routers import auth, tweets

# Initialize the app
app = FastAPI(
    title="Twinglish API",
    description="Twitter-style application for language learning",
    version="0.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, use settings.BACKEND_CORS_ORIGINS
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global error handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"Error: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": f"Server error: {str(exc)}"}
    )

# Include routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(tweets.router, prefix=f"{settings.API_V1_STR}/tweets", tags=["tweets"])

# Root endpoint
@app.get("/")
def root():
    return {"message": "Welcome to Twinglish API", "version": "0.1.0"}

# Debug endpoint for token validation
@app.get("/api/v1/debug-token")
def debug_token(authorization: Optional[str] = Header(None), token: Optional[str] = Header(None)):
    """Debug endpoint to check token validation."""
    from app.simple_auth import validate_token
    
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
