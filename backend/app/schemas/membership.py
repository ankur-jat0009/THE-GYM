from typing import Optional, List
from datetime import date, datetime
from pydantic import BaseModel, Field, ConfigDict


class MembershipPlanBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    duration_months: int = Field(1, ge=1)
    duration_days: int = Field(30, ge=1)
    price: float = Field(..., ge=0)
    description: Optional[str] = None
    features: List[str] = []
    is_popular: bool = False
    is_active: bool = True


class MembershipPlanCreate(MembershipPlanBase):
    pass


class MembershipPlanUpdate(BaseModel):
    name: Optional[str] = None
    duration_months: Optional[int] = None
    duration_days: Optional[int] = None
    price: Optional[float] = None
    description: Optional[str] = None
    features: Optional[List[str]] = None
    is_popular: Optional[bool] = None
    is_active: Optional[bool] = None


class MembershipPlanResponse(MembershipPlanBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class MembershipAssignCreate(BaseModel):
    user_id: str
    plan_id: str
    start_date: Optional[date] = None
    discount_amount: float = 0.0
    notes: Optional[str] = None


class MembershipResponse(BaseModel):
    id: str
    user_id: str
    plan_id: str
    plan_name: str
    start_date: date
    end_date: date
    total_amount: float
    discount_amount: float
    final_amount: float
    status: str
    remaining_days: int
    notes: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CustomerMembershipOverview(BaseModel):
    has_membership: bool = False
    membership: Optional[MembershipResponse] = None
