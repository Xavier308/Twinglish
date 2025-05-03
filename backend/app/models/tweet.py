from sqlalchemy import Column, String, Integer, ForeignKey, Text
from sqlalchemy.orm import relationship
from .base import Base

class Tweet(Base):
    original_text = Column(String(280))
    corrected_text = Column(String(280))
    explanation = Column(Text)
    user_id = Column(Integer, ForeignKey("user.id"))
    user = relationship("User", back_populates="tweets")
