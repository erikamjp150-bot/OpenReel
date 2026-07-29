from typing import List
from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    model_config = {
        "env_file": ".env",
        "env_prefix": "",
    }

    DATABASE_URL: str = Field("postgresql://openreel:openreel@localhost:5432/openreel")
    MINIO_ENDPOINT: str = Field("http://localhost:9000")
    MINIO_ACCESS_KEY: str = Field("minioadmin")
    MINIO_SECRET_KEY: str = Field("minioadmin")
    MINIO_BUCKET: str = Field("openreel")
    MINIO_SECURE: bool = Field(False)
    ALLOWED_ORIGINS: List[str] = Field(["*"])
    JWT_SECRET_KEY: str = Field("supersecretkey")
    JWT_ALGORITHM: str = Field("HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(60)


settings = Settings()
