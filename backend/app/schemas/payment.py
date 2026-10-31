from typing import Optional, List
from datetime import date, datetime
from pydantic import BaseModel, Field, ConfigDict


class PaymentCreate(BaseModel):
    membership_id: str
    amount: float = Field(..., gt=0)
    payment_date: Optional[date] = None
    payment_method: str = Field("UPI", description="CASH, UPI, BANK_TRANSFER, OTHER")
    transaction_reference: Optional[str] = None
    remarks: Optional[str] = None


class PaymentResponse(BaseModel):
    id: str
    membership_id: str
    user_id: str
    user_name: Optional[str] = None
    amount: float
    payment_date: date
    payment_method: str
    transaction_reference: Optional[str] = None
    receipt_number: str
    remarks: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CustomerFeeOverview(BaseModel):
    membership_plan_name: Optional[str] = None
    total_fee: float = 0.0
    amount_paid: float = 0.0
    outstanding_amount: float = 0.0
    payment_status: str = "NO_MEMBERSHIP"  # PAID, PARTIAL, UNPAID, NO_MEMBERSHIP
    payment_due_date: Optional[date] = None
    history: List[PaymentResponse] = []


class PendingFeeItem(BaseModel):
    user_id: str
    user_name: str
    user_phone: str
    membership_id: str
    plan_name: str
    final_amount: float
    paid_amount: float
    pending_amount: float
    end_date: date


class ReceiptDetail(BaseModel):
    gym_name: str
    gym_address: str
    gym_phone: str
    receipt_number: str
    payment_date: date
    customer_name: str
    customer_phone: str
    membership_plan: str
    amount_paid: float
    total_membership_fee: float
    remaining_balance: float
    payment_method: str
    transaction_reference: Optional[str] = None
    remarks: Optional[str] = None
