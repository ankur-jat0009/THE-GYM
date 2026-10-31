import random
from datetime import date, datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import desc, func, or_
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.api.deps import get_current_admin, get_current_user
from app.models.payment import Payment
from app.models.membership import Membership
from app.models.user import User
from app.models.notification import Notification
from app.schemas.payment import (
    PaymentCreate,
    PaymentResponse,
    PendingFeeItem,
    ReceiptDetail,
)

router = APIRouter(tags=["Payments & Fee Management"])


def generate_receipt_number() -> str:
    today_str = date.today().strftime("%Y%m%d")
    rand_suffix = random.randint(1000, 9999)
    return f"TG-{today_str}-{rand_suffix}"


@router.post("/admin/payments", response_model=PaymentResponse, status_code=status.HTTP_201_CREATED)
def record_manual_payment(
    payment_in: PaymentCreate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    membership = db.query(Membership).filter(Membership.id == payment_in.membership_id).first()
    if not membership:
        raise HTTPException(status_code=404, detail="Membership record not found")

    user = membership.user
    if not user:
        raise HTTPException(status_code=404, detail="Customer not found")

    # Generate unique receipt number
    receipt_no = generate_receipt_number()
    while db.query(Payment).filter(Payment.receipt_number == receipt_no).first():
        receipt_no = generate_receipt_number()

    pay_date = payment_in.payment_date or date.today()

    new_payment = Payment(
        membership_id=membership.id,
        user_id=user.id,
        amount=payment_in.amount,
        payment_date=pay_date,
        payment_method=payment_in.payment_method.upper(),
        transaction_reference=payment_in.transaction_reference,
        receipt_number=receipt_no,
        remarks=payment_in.remarks,
        created_by_id=admin.id,
    )
    db.add(new_payment)
    db.commit()
    db.refresh(new_payment)

    # In-app notification for the customer
    notif = Notification(
        user_id=user.id,
        title="Payment Received",
        message=f"Received payment of ₹{payment_in.amount:.2f} via {payment_in.payment_method.upper()}. Receipt No: {receipt_no}.",
        type="PAYMENT_RECEIVED",
    )
    db.add(notif)
    db.commit()

    return PaymentResponse(
        id=new_payment.id,
        membership_id=new_payment.membership_id,
        user_id=new_payment.user_id,
        user_name=user.full_name,
        amount=float(new_payment.amount),
        payment_date=new_payment.payment_date,
        payment_method=new_payment.payment_method,
        transaction_reference=new_payment.transaction_reference,
        receipt_number=new_payment.receipt_number,
        remarks=new_payment.remarks,
        created_at=new_payment.created_at,
    )


@router.get("/admin/payments")
def get_payment_ledger(
    page: int = Query(1, ge=1),
    limit: int = Query(25, ge=1, le=100),
    payment_method: Optional[str] = None,
    search: Optional[str] = None,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    query = db.query(Payment)

    if payment_method:
        query = query.filter(Payment.payment_method == payment_method.upper())

    if search:
        search_filter = f"%{search.strip()}%"
        query = query.join(User, Payment.user_id == User.id).filter(
            or_(
                User.full_name.ilike(search_filter),
                User.phone.ilike(search_filter),
                Payment.receipt_number.ilike(search_filter),
            )
        )

    total = query.count()
    payments = query.order_by(desc(Payment.payment_date), desc(Payment.created_at)).offset((page - 1) * limit).limit(limit).all()

    items = [
        PaymentResponse(
            id=p.id,
            membership_id=p.membership_id,
            user_id=p.user_id,
            user_name=p.user.full_name if p.user else "Unknown",
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

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "items": items,
    }


@router.get("/admin/payments/pending", response_model=List[PendingFeeItem])
def get_pending_fees(
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    # Active memberships where total paid < final_amount
    active_memberships = (
        db.query(Membership)
        .filter(Membership.status == "active")
        .all()
    )

    pending_list = []
    for m in active_memberships:
        payments = db.query(Payment).filter(Payment.membership_id == m.id).all()
        paid_amount = sum(float(p.amount) for p in payments)
        final_amt = float(m.final_amount)
        pending_amt = round(final_amt - paid_amount, 2)

        if pending_amt > 0:
            user = m.user
            if user:
                pending_list.append(
                    PendingFeeItem(
                        user_id=user.id,
                        user_name=user.full_name,
                        user_phone=user.phone,
                        membership_id=m.id,
                        plan_name=m.plan.name if m.plan else "Custom",
                        final_amount=final_amt,
                        paid_amount=paid_amount,
                        pending_amount=pending_amt,
                        end_date=m.end_date,
                    )
                )

    return pending_list


@router.get("/payments/{payment_id}/receipt", response_model=ReceiptDetail)
def get_receipt(
    payment_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment record not found")

    # Authorize: user must own payment or be admin/staff
    if current_user.role not in ["admin", "staff"] and payment.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this receipt")

    membership = payment.membership
    user = payment.user

    # Calculate total paid and remaining balance for this membership up to this point
    all_payments = db.query(Payment).filter(Payment.membership_id == membership.id).all()
    total_paid = sum(float(p.amount) for p in all_payments)
    balance = max(0.0, float(membership.final_amount) - total_paid)

    return ReceiptDetail(
        gym_name=settings.GYM_NAME,
        gym_address=settings.GYM_ADDRESS,
        gym_phone=settings.GYM_PHONE,
        receipt_number=payment.receipt_number,
        payment_date=payment.payment_date,
        customer_name=user.full_name if user else "Customer",
        customer_phone=user.phone if user else "-",
        membership_plan=membership.plan.name if membership and membership.plan else "Gym Plan",
        amount_paid=float(payment.amount),
        total_membership_fee=float(membership.final_amount),
        remaining_balance=balance,
        payment_method=payment.payment_method,
        transaction_reference=payment.transaction_reference,
        remarks=payment.remarks,
    )
