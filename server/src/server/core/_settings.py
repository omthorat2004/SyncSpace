from functools import cached_property
from pathlib import Path
from enum import Enum
from dotenv import load_dotenv
from pydantic import Field, PostgresDsn, RedisDsn, SecretStr, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
from redis.asyncio import ConnectionPool

BASE_DIR = Path(__file__).resolve().parents[3]

class Permission(str,Enum):
    VIEW="viewer"
    EDIT="editor"


class RedisSettings(BaseSettings):
    rediscloud_url:RedisDsn
    model_config = SettingsConfigDict(
        env_file=BASE_DIR / ".env",
        extra="ignore",
        case_sensitive=False,
    )
    

    
    @cached_property
    def pool(self)->ConnectionPool:
        return ConnectionPool.from_url(
            self.rediscloud_url.unicode_string(),
            decode_responses=True,
        )
    

class Settings(BaseSettings):
    database_url : PostgresDsn
    allow_origins : list[str]
    project_dir:Path = BASE_DIR
    secret_key:SecretStr
    redis:RedisSettings = Field(default_factory=RedisSettings)
    
    access_token_expire_minutes:int=10
    refresh_token_expire_day:int=7
    
    pool_max_overflow: int = 10
    pool_size: int = 5
    pool_timeout: int = 30
    pool_recycle: int = -1
    
    debug: bool = False
    environment: str = "development"
    api_v1_prefix: str = "/api/v1"
    
    permissions : Permission = Permission.VIEW
    
    @field_validator("allow_origins", mode="before")
    def parse_origins(cls, v):
        if isinstance(v, str):
            return [i.strip() for i in v.split(",")]
        return v
    
    model_config = SettingsConfigDict(
        env_file=BASE_DIR / ".env",
        env_file_encoding='utf-8',
        extra="ignore",
        case_sensitive=False,
    )


settings = Settings()