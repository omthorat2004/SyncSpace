from sqlalchemy import Base, Column, Integer, ForeignKey, String, DATETIME, func, UniqueConstraint
from datetime import datetime

class SpaceMembers(Base):
    """Store shared space data"""
    __tablename__ = "space_members"
    
    id = Column(Integer,primary_key=True,autoincrement=True)
    space_id = Column(Integer,ForeignKey("spaces.id",ondelete="CASCADE"),nullable=False)
    user_id = Column(Integer,ForeignKey("users.id",ondelete="CASCADE"),nullable=False)
    permission = Column(String, default="viewer",nullable=False)
    created_at = Column(DATETIME,server_default=func.now(),onupdate=func.now())
    
    __table_args__ = (
         UniqueConstraint(
            'space_id',
            'user_id',
            name='uq_company_department'
        ),
    )
    