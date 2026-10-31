import calendar
from datetime import date, datetime, timedelta, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, or_, desc
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_password_hash, verify_password
from app.api.deps import get_current_user, get_current_admin
from app.models.user import User
from app.models.membership import Membership, MembershipPlan
from app.models.payment import Payment
from app.models.attendance import Attendance
from app.models.workout import WorkoutPlan, WorkoutExercise, CustomerWorkoutAssignment
from app.models.notification import Notification
from app.schemas.user import (
    UserResponse,
    UserProfileUpdate,
    PasswordChange,
    UserAdminCreate,
    UserAdminUpdate,
    UserStatusToggle,
    CustomerDetailResponse,
)
from app.schemas.membership import MembershipResponse, CustomerMembershipOverview
from app.schemas.payment import CustomerFeeOverview, PaymentResponse
from app.schemas.attendance import CustomerAttendanceOverview, AttendanceResponse, AttendanceCalendarDay
from app.schemas.workout import CustomerAssignedWorkoutResponse, WorkoutPlanResponse, WorkoutExerciseResponse

router = APIRouter(tags=["Users & Profiles"])


# ==========================================
# CUSTOMER SELF-SERVICE ENDPOINTS
# ==========================================

@router.get("/users/me", response_model=UserResponse)
def get_my_profile(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)


@router.patch("/users/me", response_model=UserResponse)
def update_my_profile(
    profile_in: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if profile_in.phone and profile_in.phone != current_user.phone:
        existing = db.query(User).filter(User.phone == profile_in.phone, User.id != current_user.id).first()
        if existing:
            raise HTTPException(status_code=400, detail="This phone number is already registered to another account")
        current_user.phone = profile_in.phone

    if profile_in.full_name is not None:
        current_user.full_name = profile_in.full_name
    if profile_in.gender is not None:
        current_user.gender = profile_in.gender
    if profile_in.date_of_birth is not None:
        current_user.date_of_birth = profile_in.date_of_birth

    db.commit()
    db.refresh(current_user)
    return UserResponse.model_validate(current_user)


@router.post("/users/me/change-password")
def change_my_password(
    data: PasswordChange,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not verify_password(data.old_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Current password does not match")
    current_user.hashed_password = get_password_hash(data.new_password)
    db.commit()
    return {"message": "Password updated successfully"}


@router.get("/users/me/membership", response_model=CustomerMembershipOverview)
def get_my_membership(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Find latest active membership
    active_m = (
        db.query(Membership)
        .filter(Membership.user_id == current_user.id)
        .order_by(desc(Membership.created_at))
        .first()
    )

    if not active_m:
        return CustomerMembershipOverview(has_membership=False, membership=None)

    today = date.today()
    remaining = (active_m.end_date - today).days
    if remaining < 0:
        remaining = 0
        if active_m.status == "active":
            active_m.status = "expired"
            db.commit()

    plan_name = active_m.plan.name if active_m.plan else "Gym Membership"

    membership_resp = MembershipResponse(
        id=active_m.id,
        user_id=active_m.user_id,
        plan_id=active_m.plan_id,
        plan_name=plan_name,
        start_date=active_m.start_date,
        end_date=active_m.end_date,
        total_amount=float(active_m.total_amount),
        discount_amount=float(active_m.discount_amount),
        final_amount=float(active_m.final_amount),
        status=active_m.status,
        remaining_days=remaining,
        notes=active_m.notes,
        created_at=active_m.created_at,
    )
    return CustomerMembershipOverview(has_membership=True, membership=membership_resp)


@router.get("/users/me/attendance", response_model=CustomerAttendanceOverview)
def get_my_attendance(
    month: Optional[int] = None,
    year: Optional[int] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    today = date.today()
    m = month if month and 1 <= month <= 12 else today.month
    y = year if year and year > 2000 else today.year

    start_date = date(y, m, 1)
    num_days = calendar.monthrange(y, m)[1]
    end_date = date(y, m, num_days)

    records = (
        db.query(Attendance)
        .filter(
            Attendance.user_id == current_user.id,
            Attendance.attendance_date >= start_date,
            Attendance.attendance_date <= end_date,
        )
        .order_by(Attendance.attendance_date.asc())
        .all()
    )

    present_dates = {r.attendance_date: r.check_in_time.strftime("%I:%M %p") for r in records}

    calendar_matrix: List[AttendanceCalendarDay] = []
    for day in range(1, num_days + 1):
        cur_d = date(y, m, day)
        is_pres = cur_d in present_dates
        calendar_matrix.append(
            AttendanceCalendarDay(
                date_str=cur_d.strftime("%Y-%m-%d"),
                day_of_month=day,
                is_present=is_pres,
                check_in_time=present_dates.get(cur_d),
            )
        )

    # Calculate streak (consecutive days attended ending today or yesterday)
    streak = 0
    check_day = today
    while True:
        record_exists = (
            db.query(Attendance)
            .filter(Attendance.user_id == current_user.id, Attendance.attendance_date == check_day)
            .first()
        )
        if record_exists:
            streak += 1
            check_day = check_day - timedelta(days=1)
        else:
            if check_day == today:
                check_day = check_day - timedelta(days=1)
                continue
            break

    recent_logs = (
        db.query(Attendance)
        .filter(Attendance.user_id == current_user.id)
        .order_by(desc(Attendance.attendance_date))
        .limit(10)
        .all()
    )

    recent_responses = [
        AttendanceResponse(
            id=r.id,
            user_id=r.user_id,
            user_name=current_user.full_name,
            attendance_date=r.attendance_date,
            check_in_time=r.check_in_time,
            method=r.method,
            marked_by_name=r.marked_by.full_name if r.marked_by else None,
            notes=r.notes,
        )
        for r in recent_logs
    ]

    present_count = len(records)
    percentage = round((present_count / num_days) * 100, 1)

    return CustomerAttendanceOverview(
        current_month=f"{calendar.month_name[m]} {y}",
        total_days_in_month=num_days,
        present_days_count=present_count,
        attendance_percentage=percentage,
        streak_days=streak,
        calendar_matrix=calendar_matrix,
        recent_logs=recent_responses,
    )


@router.get("/users/me/payments", response_model=CustomerFeeOverview)
def get_my_payments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Get active or latest membership
    latest_m = (
        db.query(Membership)
        .filter(Membership.user_id == current_user.id)
        .order_by(desc(Membership.created_at))
        .first()
    )

    if not latest_m:
        return CustomerFeeOverview(
            membership_plan_name=None,
            total_fee=0.0,
            amount_paid=0.0,
            outstanding_amount=0.0,
            payment_status="NO_MEMBERSHIP",
            payment_due_date=None,
            history=[],
        )

    # Sum payments for this membership
    payments = (
        db.query(Payment)
        .filter(Payment.membership_id == latest_m.id)
        .order_by(desc(Payment.payment_date))
        .all()
    )

    total_paid = sum(float(p.amount) for p in payments)
    final_amount = float(latest_m.final_amount)
    balance = max(0.0, round(final_amount - total_paid, 2))

    if balance <= 0:
        status_str = "PAID"
    elif total_paid > 0:
        status_str = "PARTIAL"
    else:
        status_str = "UNPAID"

    history = [
        PaymentResponse(
            id=p.id,
            membership_id=p.membership_id,
            user_id=p.user_id,
            user_name=current_user.full_name,
            amount=float(p.amount),
            payment_date=p.payment_date,
            payment_method=p.payment_method,
            transaction_reference=p.transaction_reference,
            receipt_number=p.receipt_number,
            remarks=p.remarks,
            created_at=p.created_at,
        )
        for p in payments
    ]

    return CustomerFeeOverview(
        membership_plan_name=latest_m.plan.name if latest_m.plan else "Gym Plan",
        total_fee=final_amount,
        amount_paid=total_paid,
        outstanding_amount=balance,
        payment_status=status_str,
        payment_due_date=latest_m.end_date,
        history=history,
    )


@router.get("/users/me/workouts", response_model=CustomerAssignedWorkoutResponse)
def get_my_workout(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    assignment = (
        db.query(CustomerWorkoutAssignment)
        .filter(CustomerWorkoutAssignment.user_id == current_user.id, CustomerWorkoutAssignment.is_active == True)
        .order_by(desc(CustomerWorkoutAssignment.assigned_at))
        .first()
    )

    if not assignment or not assignment.plan:
        return CustomerAssignedWorkoutResponse(has_assignment=False, plan=None, assigned_at=None, notes=None)

    plan = assignment.plan
    exercises_resp = [
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
    ]

    plan_resp = WorkoutPlanResponse(
        id=plan.id,
        category_id=plan.category_id,
        category_name=plan.category.name if plan.category else None,
        title=plan.title,
        description=plan.description,
        difficulty_level=plan.difficulty_level,
        duration_weeks=plan.duration_weeks,
        is_active=plan.is_active,
        exercises=exercises_resp,
        created_at=plan.created_at,
        updated_at=plan.updated_at,
    )

    return CustomerAssignedWorkoutResponse(
        has_assignment=True,
        plan=plan_resp,
        assigned_at=assignment.assigned_at,
        notes=assignment.notes,
    )


# ==========================================
# ADMIN MANAGEMENT ENDPOINTS
# ==========================================

@router.get("/admin/users")
def get_all_users_admin(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    is_active: Optional[bool] = None,
    role: Optional[str] = None,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    query = db.query(User)

    if search:
        search_filter = f"%{search.strip()}%"
        query = query.filter(
            or_(
                User.full_name.ilike(search_filter),
                User.phone.ilike(search_filter),
                User.email.ilike(search_filter),
            )
        )

    if is_active is not None:
        query = query.filter(User.is_active == is_active)

    if role:
        query = query.filter(User.role == role)
    else:
        # Default show customers primarily
        pass

    total = query.count()
    users = query.order_by(desc(User.created_at)).offset((page - 1) * limit).limit(limit).all()

    items = []
    today = date.today()
    for u in users:
        # Get active membership info
        m = (
            db.query(Membership)
            .filter(Membership.user_id == u.id)
            .order_by(desc(Membership.created_at))
            .first()
        )
        m_info = None
        if m:
            days_left = max(0, (m.end_date - today).days)
            m_info = {
                "id": m.id,
                "plan_name": m.plan.name if m.plan else "Custom",
                "start_date": m.start_date.isoformat(),
                "end_date": m.end_date.isoformat(),
                "status": m.status,
                "remaining_days": days_left,
            }

        # Fee calculations
        total_paid = 0.0
        pending_due = 0.0
        if m:
            payments = db.query(Payment).filter(Payment.membership_id == m.id).all()
            total_paid = sum(float(p.amount) for p in payments)
            pending_due = max(0.0, float(m.final_amount) - total_paid)

        # Monthly attendance count
        m_start = date(today.year, today.month, 1)
        att_count = (
            db.query(func.count(Attendance.id))
            .filter(Attendance.user_id == u.id, Attendance.attendance_date >= m_start)
            .scalar()
            or 0
        )

        items.append({
            "id": u.id,
            "full_name": u.full_name,
            "email": u.email,
            "phone": u.phone,
            "role": u.role,
            "is_active": u.is_active,
            "gender": u.gender,
            "date_of_birth": u.date_of_birth.isoformat() if u.date_of_birth else None,
            "membership": m_info,
            "total_paid": round(total_paid, 2),
            "pending_due": round(pending_due, 2),
            "month_attendance": att_count,
            "created_at": u.created_at.isoformat(),
        })

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "items": items,
    }


@router.post("/admin/users", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def admin_create_user(
    user_in: UserAdminCreate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    if db.query(User).filter(User.email == user_in.email).first():
        raise HTTPException(status_code=400, detail="Email is already registered")
    if db.query(User).filter(User.phone == user_in.phone).first():
        raise HTTPException(status_code=400, detail="Phone number is already registered")

    new_user = User(
        full_name=user_in.full_name,
        email=user_in.email,
        phone=user_in.phone,
        hashed_password=get_password_hash(user_in.password),
        role=user_in.role,
        is_active=user_in.is_active,
        gender=user_in.gender,
        date_of_birth=user_in.date_of_birth,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return UserResponse.model_validate(new_user)


@router.get("/admin/users/{user_id}")
def admin_get_user_detail(
    user_id: str,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    memberships = db.query(Membership).filter(Membership.user_id == user.id).order_by(desc(Membership.created_at)).all()
    payments = db.query(Payment).filter(Payment.user_id == user.id).order_by(desc(Payment.payment_date)).all()
    attendance = db.query(Attendance).filter(Attendance.user_id == user.id).order_by(desc(Attendance.attendance_date)).limit(30).all()

    today = date.today()
    latest_m = memberships[0] if memberships else None
    pending_due = 0.0
    total_paid = sum(float(p.amount) for p in payments)
    if latest_m:
        m_payments = [p for p in payments if p.membership_id == latest_m.id]
        m_paid = sum(float(p.amount) for p in m_payments)
        pending_due = max(0.0, float(latest_m.final_amount) - m_paid)

    return {
        "user": UserResponse.model_validate(user),
        "memberships": [
            {
                "id": m.id,
                "plan_name": m.plan.name if m.plan else "Custom",
                "start_date": m.start_date.isoformat(),
                "end_date": m.end_date.isoformat(),
                "final_amount": float(m.final_amount),
                "status": m.status,
                "remaining_days": max(0, (m.end_date - today).days),
            }
            for m in memberships
        ],
        "payments": [
            {
                "id": p.id,
                "amount": float(p.amount),
                "payment_date": p.payment_date.isoformat(),
                "payment_method": p.payment_method,
                "receipt_number": p.receipt_number,
                "remarks": p.remarks,
            }
            for p in payments
        ],
        "attendance": [
            {
                "id": a.id,
                "attendance_date": a.attendance_date.isoformat(),
                "check_in_time": a.check_in_time.isoformat(),
                "method": a.method,
            }
            for a in attendance
        ],
        "stats": {
            "total_paid": round(total_paid, 2),
            "pending_due": round(pending_due, 2),
            "total_check_ins": len(attendance),
        }
    }


@router.patch("/admin/users/{user_id}", response_model=UserResponse)
def admin_update_user(
    user_id: str,
    update_in: UserAdminUpdate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if update_in.email and update_in.email != user.email:
        if db.query(User).filter(User.email == update_in.email, User.id != user.id).first():
            raise HTTPException(status_code=400, detail="Email is already used by another account")
        user.email = update_in.email

    if update_in.phone and update_in.phone != user.phone:
        if db.query(User).filter(User.phone == update_in.phone, User.id != user.id).first():
            raise HTTPException(status_code=400, detail="Phone is already used by another account")
        user.phone = update_in.phone

    if update_in.full_name is not None:
        user.full_name = update_in.full_name
    if update_in.role is not None:
        user.role = update_in.role
    if update_in.is_active is not None:
        user.is_active = update_in.is_active
    if update_in.gender is not None:
        user.gender = update_in.gender
    if update_in.date_of_birth is not None:
        user.date_of_birth = update_in.date_of_birth
    if update_in.password:
        user.hashed_password = get_password_hash(update_in.password)

    db.commit()
    db.refresh(user)
    return UserResponse.model_validate(user)


@router.patch("/admin/users/{user_id}/status", response_model=UserResponse)
def admin_toggle_user_status(
    user_id: str,
    status_in: UserStatusToggle,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_active = status_in.is_active
    db.commit()
    db.refresh(user)
    return UserResponse.model_validate(user)
