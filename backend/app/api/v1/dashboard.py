from datetime import date, datetime, timedelta
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy import func, desc, or_
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.deps import get_current_admin
from app.models.user import User
from app.models.membership import Membership
from app.models.payment import Payment
from app.models.attendance import Attendance
from app.schemas.dashboard import (
    AdminDashboardSummary,
    DashboardKPIs,
    RecentAttendanceItem,
    RecentPaymentItem,
    ExpiringMemberItem,
)

router = APIRouter(prefix="/admin/dashboard", tags=["Admin Dashboard"])


@router.get("/summary", response_model=AdminDashboardSummary)
def get_admin_dashboard_summary(
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    today = date.today()
    month_start = date(today.year, today.month, 1)

    # 1. Total customers
    total_customers = db.query(func.count(User.id)).filter(User.role == "customer").scalar() or 0

    # 2. Active memberships
    active_members = (
        db.query(func.count(Membership.id))
        .filter(Membership.status == "active", Membership.end_date >= today)
        .scalar()
        or 0
    )

    # 3. Expired memberships
    expired_members = (
        db.query(func.count(Membership.id))
        .filter(or_(Membership.status == "expired", Membership.end_date < today))
        .scalar()
        or 0
    )

    # 4. Today's attendance
    today_att = (
        db.query(func.count(Attendance.id))
        .filter(Attendance.attendance_date == today)
        .scalar()
        or 0
    )

    # 5. Month's attendance
    month_att = (
        db.query(func.count(Attendance.id))
        .filter(Attendance.attendance_date >= month_start)
        .scalar()
        or 0
    )

    # 6. Today's collections
    today_payments = (
        db.query(func.coalesce(func.sum(Payment.amount), 0.0))
        .filter(Payment.payment_date == today)
        .scalar()
        or 0.0
    )

    # 7. Total pending fees
    active_ms = db.query(Membership).filter(Membership.status == "active").all()
    total_pending = 0.0
    for m in active_ms:
        m_payments = db.query(Payment).filter(Payment.membership_id == m.id).all()
        m_paid = sum(float(p.amount) for p in m_payments)
        due = float(m.final_amount) - m_paid
        if due > 0:
            total_pending += due

    # 8. Upcoming expirations in next 7 days
    next_7_days = today + timedelta(days=7)
    expiring_soon_count = (
        db.query(func.count(Membership.id))
        .filter(
            Membership.status == "active",
            Membership.end_date >= today,
            Membership.end_date <= next_7_days,
        )
        .scalar()
        or 0
    )

    kpis = DashboardKPIs(
        total_customers=total_customers,
        active_members=active_members,
        expired_members=expired_members,
        today_attendance=today_att,
        month_attendance=month_att,
        today_collections=round(float(today_payments), 2),
        total_pending_fees=round(total_pending, 2),
        expiring_soon_count=expiring_soon_count,
    )

    # Recent check-ins
    recent_checkins = (
        db.query(Attendance)
        .order_by(desc(Attendance.created_at))
        .limit(6)
        .all()
    )
    recent_att_items = [
        RecentAttendanceItem(
            user_id=a.user_id,
            user_name=a.user.full_name if a.user else "Member",
            check_in_time=a.check_in_time,
            method=a.method,
        )
        for a in recent_checkins
    ]

    # Recent payments
    recent_pays = (
        db.query(Payment)
        .order_by(desc(Payment.payment_date), desc(Payment.created_at))
        .limit(6)
        .all()
    )
    recent_pay_items = [
        RecentPaymentItem(
            payment_id=p.id,
            user_name=p.user.full_name if p.user else "Member",
            amount=float(p.amount),
            payment_method=p.payment_method,
            payment_date=p.payment_date,
            receipt_number=p.receipt_number,
        )
        for p in recent_pays
    ]

    # Expiring members list
    expiring_query = (
        db.query(Membership)
        .filter(
            Membership.status == "active",
            Membership.end_date >= today,
            Membership.end_date <= next_7_days,
        )
        .order_by(Membership.end_date.asc())
        .limit(8)
        .all()
    )
    expiring_items = [
        ExpiringMemberItem(
            user_id=m.user_id,
            user_name=m.user.full_name if m.user else "Member",
            phone=m.user.phone if m.user else "-",
            plan_name=m.plan.name if m.plan else "Gym Plan",
            end_date=m.end_date,
            days_left=max(0, (m.end_date - today).days),
        )
        for m in expiring_query
    ]

    return AdminDashboardSummary(
        kpis=kpis,
        recent_check_ins=recent_att_items,
        recent_payments=recent_pay_items,
        expiring_members=expiring_items,
    )
