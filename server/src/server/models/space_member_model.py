from sqlalchemy import Column, Integer, ForeignKey, String, DateTime, func, UniqueConstraint
from datetime import datetime
from src.server.database.database import Base
from sqlalchemy.orm import relationship
from src.server.core.constants import VIEWER


class SpaceMember(Base):
    """Store shared space data"""
    __tablename__ = "space_members"
    
    id = Column(Integer,primary_key=True,autoincrement=True)
    space_id = Column(Integer,ForeignKey("spaces.id",ondelete="CASCADE"),nullable=False)
    user_id = Column(Integer,ForeignKey("users.id",ondelete="CASCADE"),nullable=False)
    permission = Column(String, default=VIEWER,nullable=False)
    created_at = Column(DateTime,server_default=func.now(),onupdate=func.now())
    
    
    user = relationship("User",back_populates="shared_spaces")
    space = relationship("Space",back_populates="shared_spaces")
    __table_args__ = (
         UniqueConstraint(
            'space_id',
            'user_id',
            name='uq_company_department'
        ),
    )
    