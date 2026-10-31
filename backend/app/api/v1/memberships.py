from datetime import date, datetime, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import desc
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.deps import get_current_admin
from app.models.membership import MembershipPlan, Membership
from app.models.user import User
from app.models.notification import Notification
from app.schemas.membership import (
    MembershipPlanCreate,
    MembershipPlanUpdate,
    MembershipPlanResponse,
    MembershipAssignCreate,
    MembershipResponse,
)

router = APIRouter(tags=["Memberships & Plans"])


# ==========================================
# PUBLIC MEMBERSHIP PLANS (For Landing Page)
# ==========================================

@router.get("/membership-plans", response_model=List[MembershipPlanResponse])
def get_public_membership_plans(db: Session = Depends(get_db)):
    """
    Public API: Fetches all active membership plans for website display.
    Never hardcoded in frontend.
    """
    plans = (
        db.query(MembershipPlan)
        .filter(MembershipPlan.is_active == True)
        .order_by(MembershipPlan.duration_months.asc(), MembershipPlan.price.asc())
        .all()
    )
    return [
        MembershipPlanResponse(
            id=p.id,
            name=p.name,
            duration_months=p.duration_months,
            duration_days=p.duration_days,
            price=float(p.price),
            description=p.description,
            features=p.features,
            is_popular=p.is_popular,
            is_active=p.is_active,
            created_at=p.created_at,
            updated_at=p.updated_at,
        )
        for p in plans
    ]


# ==========================================
# ADMIN MEMBERSHIP MANAGEMENT
# ==========================================

@router.get("/admin/membership-plans", response_model=List[MembershipPlanResponse])
def get_admin_membership_plans(
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    plans = (
        db.query(MembershipPlan)
        .order_by(desc(MembershipPlan.is_active), MembershipPlan.duration_months.asc())
        .all()
    )
    return [
        MembershipPlanResponse(
            id=p.id,
            name=p.name,
            duration_months=p.duration_months,
            duration_days=p.duration_days,
            price=float(p.price),
            description=p.description,
            features=p.features,
            is_popular=p.is_popular,
            is_active=p.is_active,
            created_at=p.created_at,
            updated_at=p.updated_at,
        )
        for p in plans
    ]


@router.post("/admin/membership-plans", response_model=MembershipPlanResponse, status_code=status.HTTP_201_CREATED)
def create_membership_plan(
    plan_in: MembershipPlanCreate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    new_plan = MembershipPlan(
        name=plan_in.name,
        duration_months=plan_in.duration_months,
        duration_days=plan_in.duration_days,
        price=plan_in.price,
        description=plan_in.description,
        is_popular=plan_in.is_popular,
        is_active=plan_in.is_active,
    )
    new_plan.features = plan_in.features
    db.add(new_plan)
    db.commit()
    db.refresh(new_plan)

    return MembershipPlanResponse(
        id=new_plan.id,
        name=new_plan.name,
        duration_months=new_plan.duration_months,
        duration_days=new_plan.duration_days,
        price=float(new_plan.price),
        description=new_plan.description,
        features=new_plan.features,
        is_popular=new_plan.is_popular,
        is_active=new_plan.is_active,
        created_at=new_plan.created_at,
        updated_at=new_plan.updated_at,
    )


@router.patch("/admin/membership-plans/{plan_id}", response_model=MembershipPlanResponse)
def update_membership_plan(
    plan_id: str,
    update_in: MembershipPlanUpdate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    plan = db.query(MembershipPlan).filter(MembershipPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Membership plan not found")

    if update_in.name is not None:
        plan.name = update_in.name
    if update_in.duration_months is not None:
        plan.duration_months = update_in.duration_months
    if update_in.duration_days is not None:
        plan.duration_days = update_in.duration_days
    if update_in.price is not None:
        plan.price = update_in.price
    if update_in.description is not None:
        plan.description = update_in.description
    if update_in.features is not None:
        plan.features = update_in.features
    if update_in.is_popular is not None:
        plan.is_popular = update_in.is_popular
    if update_in.is_active is not None:
        plan.is_active = update_in.is_active

    db.commit()
    db.refresh(plan)

    return MembershipPlanResponse(
        id=plan.id,
        name=plan.name,
        duration_months=plan.duration_months,
        duration_days=plan.duration_days,
        price=float(plan.price),
        description=plan.description,
        features=plan.features,
        is_popular=plan.is_popular,
        is_active=plan.is_active,
        created_at=plan.created_at,
        updated_at=plan.updated_at,
    )


@router.delete("/admin/membership-plans/{plan_id}")
def delete_membership_plan(
    plan_id: str,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    plan = db.query(MembershipPlan).filter(MembershipPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Membership plan not found")

    # Soft delete / deactivate so historical memberships remain intact
    plan.is_active = False
    db.commit()
    return {"message": f"Plan '{plan.name}' deactivated successfully"}


@router.post("/admin/memberships/assign", response_model=MembershipResponse)
def assign_membership(
    assign_in: MembershipAssignCreate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == assign_in.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Customer not found")

    plan = db.query(MembershipPlan).filter(MembershipPlan.id == assign_in.plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Membership plan not found")

    start_d = assign_in.start_date or date.today()
    # End date calculated from plan duration
    end_d = start_d + timedelta(days=plan.duration_days)

    total_price = float(plan.price)
    discount = float(assign_in.discount_amount or 0.0)
    final_price = max(0.0, total_price - discount)

    # Deactivate or mark previous active memberships as expired/renewed
    existing_memberships = (
        db.query(Membership)
        .filter(Membership.user_id == user.id, Membership.status == "active")
        .all()
    )
    for em in existing_memberships:
        em.status = "expired"

    new_membership = Membership(
        user_id=user.id,
        plan_id=plan.id,
        start_date=start_d,
        end_date=end_d,
        total_amount=total_price,
        discount_amount=discount,
        final_amount=final_price,
        status="active",
        notes=assign_in.notes,
    )
    db.add(new_membership)
    db.commit()
    db.refresh(new_membership)

    # In-app notification for the customer
    notif = Notification(
        user_id=user.id,
        title="Membership Activated!",
        message=f"Your '{plan.name}' membership is now active from {start_d.strftime('%d %b %Y')} to {end_d.strftime('%d %b %Y')}.",
        type="ANNOUNCEMENT",
    )
    db.add(notif)
    db.commit()

    remaining_days = max(0, (end_d - date.today()).days)

    return MembershipResponse(
        id=new_membership.id,
        user_id=new_membership.user_id,
        plan_id=new_membership.plan_id,
        plan_name=plan.name,
        start_date=new_membership.start_date,
        end_date=new_membership.end_date,
        total_amount=float(new_membership.total_amount),
        discount_amount=float(new_membership.discount_amount),
        final_amount=float(new_membership.final_amount),
        status=new_membership.status,
        remaining_days=remaining_days,
        notes=new_membership.notes,
        created_at=new_membership.created_at,
    )
