from typing import List, Optional
from datetime import date, datetime
from pydantic import BaseModel


class DashboardKPIs(BaseModel):
    total_customers: int
    active_members: int
    expired_members: int
    today_attendance: int
    month_attendance: int
    today_collections: float
    total_pending_fees: float
    expiring_soon_count: int  # Next 7 days


class RecentAttendanceItem(BaseModel):
    user_id: str
    user_name: str
    check_in_time: datetime
    method: str


class RecentPaymentItem(BaseModel):
    payment_id: str
    user_name: str
    amount: float
    payment_method: str
    payment_date: date
    receipt_number: str


class ExpiringMemberItem(BaseModel):
    user_id: str
    user_name: str
    phone: str
    plan_name: str
    end_date: date
    days_left: int


class AdminDashboardSummary(BaseModel):
    kpis: DashboardKPIs
    recent_check_ins: List[RecentAttendanceItem]
    recent_payments: List[RecentPaymentItem]
    expiring_members: List[ExpiringMemberItem]
