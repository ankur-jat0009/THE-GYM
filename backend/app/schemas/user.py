from typing import Optional, List
from datetime import date, datetime
from pydantic import BaseModel, EmailStr, Field, ConfigDict


class UserBase(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    phone: str = Field(..., min_length=10, max_length=20)
    gender: Optional[str] = None
    date_of_birth: Optional[date] = None


class UserCreate(UserBase):
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    username: str  # Can be email or phone
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserResponse"


class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    gender: Optional[str] = None
    date_of_birth: Optional[date] = None


class PasswordChange(BaseModel):
    old_password: str
    new_password: str = Field(..., min_length=6)


class UserAdminCreate(UserBase):
    password: str = Field(..., min_length=6)
    role: str = "customer"
    is_active: bool = True


class UserAdminUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None
    gender: Optional[str] = None
    date_of_birth: Optional[date] = None
    password: Optional[str] = None


class UserStatusToggle(BaseModel):
    is_active: bool


class UserResponse(UserBase):
    id: str
    role: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CustomerDetailResponse(UserResponse):
    active_membership: Optional[dict] = None
    total_paid: float = 0.0
    pending_due: float = 0.0
    attendance_count_month: int = 0
