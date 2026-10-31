import uuid
from sqlalchemy import Column, String, Integer, Boolean, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.core.database import Base


class WorkoutCategory(Base):
    __tablename__ = "workout_categories"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    display_order = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationships
    plans = relationship("WorkoutPlan", back_populates="category", cascade="all, delete-orphan", order_by="WorkoutPlan.title")


class WorkoutPlan(Base):
    __tablename__ = "workout_plans"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    category_id = Column(String(36), ForeignKey("workout_categories.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    difficulty_level = Column(String(30), nullable=False, default="Beginner")  # Beginner, Intermediate, Advanced
    duration_weeks = Column(Integer, nullable=False, default=4)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    category = relationship("WorkoutCategory", back_populates="plans")
    exercises = relationship("WorkoutExercise", back_populates="plan", cascade="all, delete-orphan", order_by="WorkoutExercise.display_order")
    assignments = relationship("CustomerWorkoutAssignment", back_populates="plan", cascade="all, delete-orphan")


class WorkoutExercise(Base):
    __tablename__ = "workout_exercises"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    plan_id = Column(String(36), ForeignKey("workout_plans.id", ondelete="CASCADE"), nullable=False, index=True)
    day_name = Column(String(50), nullable=False)  # e.g., "Day 1: Chest & Triceps"
    exercise_name = Column(String(150), nullable=False)
    sets = Column(Integer, nullable=False, default=3)
    reps = Column(String(50), nullable=False, default="10-12 reps")
    rest_seconds = Column(Integer, nullable=False, default=60)
    instructions = Column(Text, nullable=True)
    display_order = Column(Integer, nullable=False, default=0)

    plan = relationship("WorkoutPlan", back_populates="exercises")


class CustomerWorkoutAssignment(Base):
    __tablename__ = "customer_workout_assignments"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    plan_id = Column(String(36), ForeignKey("workout_plans.id", ondelete="CASCADE"), nullable=False, index=True)
    assigned_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    notes = Column(Text, nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)

    user = relationship("User", back_populates="workout_assignments")
    plan = relationship("WorkoutPlan", back_populates="assignments")
