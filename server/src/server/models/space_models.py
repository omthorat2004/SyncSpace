from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, func, Text, Enum
from sqlalchemy.orm import relationship
from src.server.database.database import Base
import enum
from datetime import datetime
class ContentType(str, enum.Enum):
    note = "note"
    link = "link"
    code = "code"
    


class Space(Base):
    """
    Stores workspace spaces created by users
    """
    __tablename__ = "spaces"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())
    

    owner = relationship("User", back_populates="spaces")
    contents = relationship("Content",back_populates="space")
    
class Content(Base):
    __tablename__ = "contents"

    id = Column(Integer, primary_key=True, autoincrement=True)

    space_id = Column(Integer, ForeignKey("spaces.id", ondelete="CASCADE"), nullable=False, index=True)

    title = Column(String, nullable=False)

    type = Column(Enum(ContentType), nullable=False)

    content = Column(Text, nullable=False)

    url = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    
    space = relationship("Space", back_populates="contents")

    


