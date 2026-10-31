from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base
import app.models  # Ensures all models are registered with Base.metadata

from app.api.v1.auth import router as auth_router
from app.api.v1.users import router as users_router
from app.api.v1.memberships import router as memberships_router
from app.api.v1.attendance import router as attendance_router
from app.api.v1.payments import router as payments_router
from app.api.v1.workouts import router as workouts_router
from app.api.v1.notifications import router as notifications_router
from app.api.v1.dashboard import router as dashboard_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables if not existing (ideal for immediate SQLite and Supabase startup)
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend API for THE GYM - Premium Gym Website & Lightweight Gym Management System",
    lifespan=lifespan,
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Production safe when deployed on Vercel & Render
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routers under /api/v1 (Canonical)
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(users_router, prefix=settings.API_V1_STR)
app.include_router(memberships_router, prefix=settings.API_V1_STR)
app.include_router(attendance_router, prefix=settings.API_V1_STR)
app.include_router(payments_router, prefix=settings.API_V1_STR)
app.include_router(workouts_router, prefix=settings.API_V1_STR)
app.include_router(notifications_router, prefix=settings.API_V1_STR)
app.include_router(dashboard_router, prefix=settings.API_V1_STR)

# Fallback root mounts so calls to /auth/login or /auth/register work seamlessly
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(memberships_router)
app.include_router(attendance_router)
app.include_router(payments_router)
app.include_router(workouts_router)
app.include_router(notifications_router)
app.include_router(dashboard_router)


@app.get("/")
def root():
    return {
        "gym_name": settings.GYM_NAME,
        "status": "online",
        "docs_url": "/docs",
    }


@app.get("/health")
def health_check():
    return {"status": "healthy", "version": settings.VERSION}


@app.get(f"{settings.API_V1_STR}/gym-info")
def get_gym_business_info():
    return {
        "name": settings.GYM_NAME,
        "phone": settings.GYM_PHONE,
        "address": settings.GYM_ADDRESS,
        "rating": settings.GYM_RATING,
        "review_count": settings.GYM_REVIEW_COUNT,
        "description": "THE GYM is a modern fitness center focused on helping people achieve their fitness goals through quality gym equipment, a comfortable workout environment, and a supportive fitness atmosphere.",
    }
