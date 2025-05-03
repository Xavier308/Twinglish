# app/db/base.py
# Import all the models here for Alembic to detect
from app.models.base import Base
from app.models.user import User
from app.models.tweet import Tweet

