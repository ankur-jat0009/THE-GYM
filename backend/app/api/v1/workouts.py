from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.deps import get_current_admin
from app.models.workout import WorkoutCategory, WorkoutPlan, WorkoutExercise, CustomerWorkoutAssignment
from app.models.user import User
from app.models.notification import Notification
from app.schemas.workout import (
    WorkoutCategoryResponse,
    WorkoutPlanResponse,
    WorkoutPlanCreate,
    WorkoutPlanUpdate,
    WorkoutExerciseResponse,
    WorkoutAssignRequest,
)

router = APIRouter(tags=["Workouts & Training Routines"])


# ==========================================
# PUBLIC / CUSTOMER WORKOUT BROWSING
# ==========================================

@router.get("/workouts/categories", response_model=List[WorkoutCategoryResponse])
def get_workout_categories(db: Session = Depends(get_db)):
    categories = db.query(WorkoutCategory).order_by(WorkoutCategory.display_order.asc()).all()
    return [
        WorkoutCategoryResponse(
            id=c.id,
            name=c.name,
            slug=c.slug,
            description=c.description,
            display_order=c.display_order,
            plans_count=len([p for p in c.plans if p.is_active]),
        )
        for c in categories
    ]


@router.get("/workouts/plans", response_model=List[WorkoutPlanResponse])
def get_workout_plans(
    category_slug: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(WorkoutPlan).filter(WorkoutPlan.is_active == True)

    if category_slug:
        query = query.join(WorkoutCategory, WorkoutPlan.category_id == WorkoutCategory.id).filter(
            WorkoutCategory.slug == category_slug
        )

    plans = query.all()
    results = []
    for p in plans:
        exercises = [
            WorkoutExerciseResponse(
                id=e.id,
                plan_id=e.plan_id,
                day_name=e.day_name,
                exercise_name=e.exercise_name,
                sets=e.sets,
                reps=e.reps,
                rest_seconds=e.rest_seconds,
                instructions=e.instructions,
                display_order=e.display_order,
            )
            for e in p.exercises
        ]
        results.append(
            WorkoutPlanResponse(
                id=p.id,
                category_id=p.category_id,
                category_name=p.category.name if p.category else None,
                title=p.title,
                description=p.description,
                difficulty_level=p.difficulty_level,
                duration_weeks=p.duration_weeks,
                is_active=p.is_active,
                exercises=exercises,
                created_at=p.created_at,
                updated_at=p.updated_at,
            )
        )
    return results


# ==========================================
# ADMIN WORKOUT MANAGEMENT
# ==========================================

@router.post("/admin/workouts/plans", response_model=WorkoutPlanResponse, status_code=status.HTTP_201_CREATED)
def admin_create_workout_plan(
    plan_in: WorkoutPlanCreate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    category = db.query(WorkoutCategory).filter(WorkoutCategory.id == plan_in.category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Workout category not found")

    new_plan = WorkoutPlan(
        category_id=plan_in.category_id,
        title=plan_in.title,
        description=plan_in.description,
        difficulty_level=plan_in.difficulty_level,
        duration_weeks=plan_in.duration_weeks,
        is_active=plan_in.is_active,
    )
    db.add(new_plan)
    db.commit()
    db.refresh(new_plan)

    # Add exercises
    created_exercises = []
    for idx, ex in enumerate(plan_in.exercises):
        new_ex = WorkoutExercise(
            plan_id=new_plan.id,
            day_name=ex.day_name,
            exercise_name=ex.exercise_name,
            sets=ex.sets,
            reps=ex.reps,
            rest_seconds=ex.rest_seconds,
            instructions=ex.instructions,
            display_order=ex.display_order or idx,
        )
        db.add(new_ex)
        created_exercises.append(new_ex)

    db.commit()
    db.refresh(new_plan)

    return WorkoutPlanResponse(
        id=new_plan.id,
        category_id=new_plan.category_id,
        category_name=category.name,
        title=new_plan.title,
        description=new_plan.description,
        difficulty_level=new_plan.difficulty_level,
        duration_weeks=new_plan.duration_weeks,
        is_active=new_plan.is_active,
        exercises=[
            WorkoutExerciseResponse(
                id=e.id,
                plan_id=e.plan_id,
                day_name=e.day_name,
                exercise_name=e.exercise_name,
                sets=e.sets,
                reps=e.reps,
                rest_seconds=e.rest_seconds,
                instructions=e.instructions,
                display_order=e.display_order,
            )
            for e in new_plan.exercises
        ],
        created_at=new_plan.created_at,
        updated_at=new_plan.updated_at,
    )


@router.patch("/admin/workouts/plans/{plan_id}", response_model=WorkoutPlanResponse)
def admin_update_workout_plan(
    plan_id: str,
    update_in: WorkoutPlanUpdate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    plan = db.query(WorkoutPlan).filter(WorkoutPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Workout plan not found")

    if update_in.category_id:
        plan.category_id = update_in.category_id
    if update_in.title is not None:
        plan.title = update_in.title
    if update_in.description is not None:
        plan.description = update_in.description
    if update_in.difficulty_level is not None:
        plan.difficulty_level = update_in.difficulty_level
    if update_in.duration_weeks is not None:
        plan.duration_weeks = update_in.duration_weeks
    if update_in.is_active is not None:
        plan.is_active = update_in.is_active

    if update_in.exercises is not None:
        # Clear existing exercises and replace
        db.query(WorkoutExercise).filter(WorkoutExercise.plan_id == plan.id).delete()
        for idx, ex in enumerate(update_in.exercises):
            new_ex = WorkoutExercise(
                plan_id=plan.id,
                day_name=ex.day_name,
                exercise_name=ex.exercise_name,
                sets=ex.sets,
                reps=ex.reps,
                rest_seconds=ex.rest_seconds,
                instructions=ex.instructions,
                display_order=ex.display_order or idx,
            )
            db.add(new_ex)

    db.commit()
    db.refresh(plan)

    return WorkoutPlanResponse(
        id=plan.id,
        category_id=plan.category_id,
        category_name=plan.category.name if plan.category else None,
        title=plan.title,
        description=plan.description,
        difficulty_level=plan.difficulty_level,
        duration_weeks=plan.duration_weeks,
        is_active=plan.is_active,
        exercises=[
            WorkoutExerciseResponse(
                id=e.id,
                plan_id=e.plan_id,
                day_name=e.day_name,
                exercise_name=e.exercise_name,
                sets=e.sets,
                reps=e.reps,
                rest_seconds=e.rest_seconds,
                instructions=e.instructions,
                display_order=e.display_order,
            )
            for e in plan.exercises
        ],
        created_at=plan.created_at,
        updated_at=plan.updated_at,
    )


@router.post("/admin/workouts/assign")
def assign_workout_plan_to_user(
    assign_req: WorkoutAssignRequest,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == assign_req.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Customer not found")

    plan = db.query(WorkoutPlan).filter(WorkoutPlan.id == assign_req.plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Workout plan not found")

    # Deactivate existing active assignments for this customer
    db.query(CustomerWorkoutAssignment).filter(
        CustomerWorkoutAssignment.user_id == user.id,
        CustomerWorkoutAssignment.is_active == True,
    ).update({"is_active": False})

    new_assignment = CustomerWorkoutAssignment(
        user_id=user.id,
        plan_id=plan.id,
        notes=assign_req.notes,
        is_active=True,
    )
    db.add(new_assignment)
    db.commit()
    db.refresh(new_assignment)

    # Create notification for customer
    notif = Notification(
        user_id=user.id,
        title="New Workout Routine Assigned!",
        message=f"Trainer assigned you '{plan.title}'. Check your 'My Workout Plan' tab to view exercises and schedule.",
        type="WORKOUT_ASSIGNED",
    )
    db.add(notif)
    db.commit()

    return {
        "success": True,
        "message": f"Assigned '{plan.title}' to {user.full_name}",
        "assignment_id": new_assignment.id,
    }
