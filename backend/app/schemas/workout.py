from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class WorkoutExerciseBase(BaseModel):
    day_name: str = Field(..., description="e.g. Day 1: Chest & Triceps")
    exercise_name: str
    sets: int = 3
    reps: str = "10-12 reps"
    rest_seconds: int = 60
    instructions: Optional[str] = None
    display_order: int = 0


class WorkoutExerciseCreate(WorkoutExerciseBase):
    pass


class WorkoutExerciseResponse(WorkoutExerciseBase):
    id: str
    plan_id: str

    model_config = ConfigDict(from_attributes=True)


class WorkoutPlanBase(BaseModel):
    category_id: str
    title: str
    description: Optional[str] = None
    difficulty_level: str = "Beginner"  # Beginner, Intermediate, Advanced
    duration_weeks: int = 4
    is_active: bool = True


class WorkoutPlanCreate(WorkoutPlanBase):
    exercises: List[WorkoutExerciseBase] = []


class WorkoutPlanUpdate(BaseModel):
    category_id: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    difficulty_level: Optional[str] = None
    duration_weeks: Optional[int] = None
    is_active: Optional[bool] = None
    exercises: Optional[List[WorkoutExerciseBase]] = None


class WorkoutPlanResponse(WorkoutPlanBase):
    id: str
    category_name: Optional[str] = None
    exercises: List[WorkoutExerciseResponse] = []
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class WorkoutCategoryResponse(BaseModel):
    id: str
    name: str
    slug: str
    description: Optional[str] = None
    display_order: int
    plans_count: int = 0

    model_config = ConfigDict(from_attributes=True)


class WorkoutAssignRequest(BaseModel):
    user_id: str
    plan_id: str
    notes: Optional[str] = None


class CustomerAssignedWorkoutResponse(BaseModel):
    has_assignment: bool
    plan: Optional[WorkoutPlanResponse] = None
    assigned_at: Optional[datetime] = None
    notes: Optional[str] = None
