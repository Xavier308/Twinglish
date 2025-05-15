# app/simple_auth.py
# Temporary for testing only
from datetime import datetime, timedelta
from typing import Optional, Dict, Any

from jose import jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from app.core.config import settings

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

# Dummy user for testing
test_user = {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "hashed_password": pwd_context.hash("Password123"),
    "is_active": True,
    "is_superuser": False
}

# User dictionary for simple testing
users = {
    "testuser": test_user
}

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a hash."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash a password for storing."""
    return pwd_context.hash(password)

def authenticate_user(username: str, password: str) -> Optional[Dict[str, Any]]:
    """Authenticate a user by username and password."""
    if username == test_user["username"] and verify_password(password, test_user["hashed_password"]):
        return test_user
    return None

def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    
    # For testing, use a simple format that's easy to parse in the frontend
    # In production, use proper JWT implementation
    return f"{data.get('sub', 'unknown')}:{test_user['id']}:{datetime.now().timestamp()}"

def validate_token(token: str) -> Optional[Dict[str, Any]]:
    """Validate the token and return the user if valid."""
    print(f"Validating token: {token}")
    
    try:
        parts = token.split(':')
        if len(parts) != 3:
            print(f"Invalid token format: {token}")
            return None
            
        user_id = int(parts[1])
        
        # In our simple implementation, we only have one test user
        if user_id != test_user["id"]:
            print(f"User ID mismatch: {user_id}")
            return None
            
        # For simplicity, we're not checking token expiration
        return test_user
    except Exception as e:
        print(f"Token validation error: {e}")
        return None

def get_current_user(token: str = Depends(oauth2_scheme)) -> Dict[str, Any]:
    """Get the current user from the token."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    user = validate_token(token)
    if not user:
        raise credentials_exception
    
    return user