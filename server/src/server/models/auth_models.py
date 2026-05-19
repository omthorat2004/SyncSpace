from passlib.hash import pbkdf2_sha256
from sqlalchemy import (Boolean, Column, DateTime, ForeignKey, Integer, String,
                        func)
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import relationship
from src.server.database.database import Base


class User(Base):
    """
    Stores user's data
    """
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    _password_hash = Column(String, nullable=False)
    token_version = Column(Integer, nullable=False, default=1, server_default="1")
    
    # Relationship to Space
    spaces = relationship("Space", back_populates="owner", cascade="all, delete-orphan")
    
    @hybrid_property
    def password(self):
        """Getter for password (not directly accessible for security)"""
        raise AttributeError("Password is write-only")
    
    @password.setter
    def password(self, plaintext_password: str):
        """Setter for password: hashes and stores it securely"""
        if not plaintext_password:
            raise ValueError("Password cannot be empty")
        
        self._password_hash = pbkdf2_sha256.hash(plaintext_password)
    
    def verify_password(self, plaintext_password: str) -> bool:
        """Verify a plaintext password against the stored hash"""
        return pbkdf2_sha256.verify(plaintext_password, self._password_hash)


class RefreshToken(Base):
    """Stores refresh-token metadata for validation and rotation."""

    __tablename__ = "refresh_tokens"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    token_hash = Column(String(256), nullable=False, unique=True, index=True)
    valid = Column(Boolean, nullable=False, default=True, server_default="true", index=True)
    ip_address = Column(String(45), nullable=True)
    token_version = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )
    
