from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict
import os


class Settings(BaseSettings):
    PROJECT_NAME: str = "THE GYM Management API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # Gym Business Info (Single Source of Truth)
    GYM_NAME: str = "THE GYM"
    GYM_PHONE: str = "+91 99929 63807"
    GYM_ADDRESS: str = (
        "Neelkanth Enclave, Plot No. 9, Gali No. 1, Near Ekta Hospital, Badshahpur, Sector 69, Gurugram, Haryana – 122101"
    )
    GYM_RATING: float = 5.0
    GYM_REVIEW_COUNT: int = 9

    # Database: Supabase PostgreSQL in production, SQLite fallback for local test
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./thegym.db")

    # Security
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "gym-super-secret-key-2026-production-ready-auth-jwt")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # CORS origins
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://localhost:4173",
        "https://thegym-gurugram.vercel.app",
    ]

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True, extra="ignore")


settings = Settings()
