import json
from datetime import date, datetime, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, desc
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import generate_qr_payload, verify_qr_payload
from app.api.deps import get_current_user, get_current_admin
from app.models.user import User
from app.models.membership import Membership
from app.models.attendance import Attendance
from app.models.notification import Notification
from app.schemas.attendance import (
    QRTokenResponse,
    AttendanceScanRequest,
    AttendanceManualRequest,
    AttendanceResponse,
    MemberCheckinRequest,
)

router = APIRouter(prefix="/attendance", tags=["Attendance & QR"])


@router.get("/gym-qr")
def get_gym_official_qr():
    """
    Returns the official gym check-in QR code payload.
    Displayed on the front desk or printed on the gym entrance wall for members to scan.
    """
    qr_data = {
        "gym": "THE GYM",
        "branch": "Badshahpur, Sector 69, Gurugram",
        "action": "ATTENDANCE_CHECKIN",
        "code": "THE_GYM_OFFICIAL_CHECKIN_2026",
        "location": "Neelkanth Enclave, Plot No. 9, Gali No. 1, Near Ekta Hospital, Badshahpur, Sector 69, Gurugram",
    }
    return {
        "qr_payload": json.dumps(qr_data),
        "code": "THE_GYM_OFFICIAL_CHECKIN_2026",
        "gym_name": "THE GYM",
        "location": "Neelkanth Enclave, Plot No. 9, Gali No. 1, Near Ekta Hospital, Badshahpur, Sector 69, Gurugram",
    }


@router.post("/member-checkin")
def member_self_checkin(
    checkin_req: MemberCheckinRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Allows an authenticated member to scan the gym counter QR code and mark their attendance.
    """
    raw_payload = checkin_req.qr_payload.strip()

    is_valid = False
    if "THE_GYM" in raw_payload or "thegym" in raw_payload.lower():
        is_valid = True
    else:
        try:
            parsed = json.loads(raw_payload)
            if parsed.get("action") == "ATTENDANCE_CHECKIN" or parsed.get("gym") == "THE GYM" or "THE_GYM" in str(parsed):
                is_valid = True
        except Exception:
            pass

    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid QR Code. Please point your camera at THE GYM Official Check-In QR code displayed at the gym counter.",
        )

    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your gym membership account is inactive. Please contact the front desk.",
        )

    today = date.today()
    existing = (
        db.query(Attendance)
        .filter(Attendance.user_id == current_user.id, Attendance.attendance_date == today)
        .first()
    )

    if existing:
        checkin_time_str = existing.check_in_time.strftime("%I:%M %p")
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Already Checked In! You have already marked attendance today at {checkin_time_str}. Have a great workout!",
        )

    # Check active membership status for informative notice
    membership = (
        db.query(Membership)
        .filter(Membership.user_id == current_user.id)
        .order_by(desc(Membership.created_at))
        .first()
    )
    membership_warning = None
    if not membership:
        membership_warning = "Note: No active membership plan found. Please see front desk."
    elif membership.end_date < today:
        membership_warning = f"Note: Membership expired on {membership.end_date.strftime('%d %b %Y')}. Please renew at the counter."

    # Record attendance
    new_attendance = Attendance(
        user_id=current_user.id,
        attendance_date=today,
        marked_by_id=None,
        method="QR_SCAN",
        notes="Scanned official gym counter QR code",
    )
    db.add(new_attendance)

    # Create notification for member
    time_str = datetime.now().strftime("%I:%M %p")
    notif = Notification(
        user_id=current_user.id,
        title="Attendance Marked! 💪",
        message=f"Welcome to THE GYM! Your workout check-in for today at {time_str} is confirmed.",
        type="ATTENDANCE",
    )
    db.add(notif)
    db.commit()
    db.refresh(new_attendance)

    return {
        "success": True,
        "message": f"Attendance marked successfully! Welcome to THE GYM, {current_user.full_name}!",
        "check_in_time": time_str,
        "date": today.isoformat(),
        "membership_warning": membership_warning,
    }


@router.get("/qr", response_model=QRTokenResponse)
def get_customer_qr_code(current_user: User = Depends(get_current_user)):
    """
    Returns secure, non-guessable HMAC signed attendance QR payload for the customer.
    Customers cannot mark their own attendance with this; it must be scanned by gym staff.
    """
    qr_dict = generate_qr_payload(current_user.id, current_user.qr_token_salt)
    payload_str = json.dumps(qr_dict)
    return QRTokenResponse(
        user_id=current_user.id,
        token_payload=payload_str,
        qr_data=qr_dict,
        generated_at=qr_dict["t"],
        expires_in_seconds=3600,
    )


@router.post("/scan")
def scan_qr_attendance(
    scan_req: AttendanceScanRequest,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """
    Admin/Staff scans customer's QR code.
    1. Parses & verifies cryptographic HMAC signature.
    2. Validates user existence & active status.
    3. Prevents duplicate daily attendance.
    4. Validates membership status.
    5. Records attendance with timestamp and marked_by.
    """
    try:
        data = json.loads(scan_req.qr_payload)
        user_id = data.get("uid")
        salt = data.get("salt")
        timestamp = int(data.get("t", 0))
        signature = data.get("sig")
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid QR code format. Please ask customer to refresh their QR code.",
        )

    if not user_id or not salt or not signature:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Malformed QR code data",
        )

    # Verify signature
    if not verify_qr_payload(user_id, salt, timestamp, signature):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="QR code verification failed. Tampered or counterfeit QR token.",
        )

    # Check user in DB
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Customer not found in gym records")

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Customer '{user.full_name}' is currently inactive. Please reactivate their account first.",
        )

    # Check daily duplicate
    today = date.today()
    existing_attendance = (
        db.query(Attendance)
        .filter(Attendance.user_id == user.id, Attendance.attendance_date == today)
        .first()
    )

    if existing_attendance:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Duplicate scan: '{user.full_name}' is already marked present today at {existing_attendance.check_in_time.strftime('%I:%M %p')}.",
        )

    # Check membership status for informative alerts
    membership = (
        db.query(Membership)
        .filter(Membership.user_id == user.id)
        .order_by(desc(Membership.created_at))
        .first()
    )
    membership_warning = None
    if not membership:
        membership_warning = "Customer does not have an active membership plan."
    elif membership.end_date < today:
        membership_warning = f"Membership expired on {membership.end_date.strftime('%d %b %Y')}."

    # Record attendance
    new_attendance = Attendance(
        user_id=user.id,
        attendance_date=today,
        marked_by_id=admin.id,
        method=scan_req.method or "QR_SCAN",
        notes="Scanned by gym staff",
    )
    db.add(new_attendance)
    db.commit()
    db.refresh(new_attendance)

    return {
        "success": True,
        "message": f"Attendance recorded successfully for {user.full_name}!",
        "customer": {
            "id": user.id,
            "full_name": user.full_name,
            "phone": user.phone,
            "membership_plan": membership.plan.name if membership and membership.plan else "None",
            "membership_status": membership.status if membership else "no_plan",
            "membership_warning": membership_warning,
        },
        "attendance": {
            "id": new_attendance.id,
            "date": new_attendance.attendance_date.isoformat(),
            "time": new_attendance.check_in_time.strftime("%I:%M %p"),
            "method": new_attendance.method,
        },
    }


@router.post("/manual")
def manual_mark_attendance(
    manual_req: AttendanceManualRequest,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """
    Fallback manual attendance marking by Admin / Staff when customer forgets phone.
    """
    user = db.query(User).filter(User.id == manual_req.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Customer not found")

    target_date = manual_req.attendance_date or date.today()

    existing = (
        db.query(Attendance)
        .filter(Attendance.user_id == user.id, Attendance.attendance_date == target_date)
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Customer is already marked present for {target_date.strftime('%d %b %Y')}.",
        )

    new_attendance = Attendance(
        user_id=user.id,
        attendance_date=target_date,
        marked_by_id=admin.id,
        method="MANUAL",
        notes=manual_req.notes or "Manual entry by staff",
    )
    db.add(new_attendance)
    db.commit()
    db.refresh(new_attendance)

    return {
        "success": True,
        "message": f"Manual attendance marked for {user.full_name}",
        "attendance_id": new_attendance.id,
    }


@router.get("/history")
def get_attendance_history(
    date_filter: Optional[date] = None,
    user_id: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(25, ge=1, le=100),
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    query = db.query(Attendance)

    if date_filter:
        query = query.filter(Attendance.attendance_date == date_filter)

    if user_id:
        query = query.filter(Attendance.user_id == user_id)

    total = query.count()
    records = query.order_by(desc(Attendance.attendance_date), desc(Attendance.check_in_time)).offset((page - 1) * limit).limit(limit).all()

    items = []
    for r in records:
        items.append({
            "id": r.id,
            "user_id": r.user_id,
            "user_name": r.user.full_name if r.user else "Unknown",
            "user_phone": r.user.phone if r.user else "-",
            "attendance_date": r.attendance_date.isoformat(),
            "check_in_time": r.check_in_time.strftime("%I:%M %p"),
            "method": r.method,
            "marked_by": r.marked_by.full_name if r.marked_by else "System",
            "notes": r.notes,
        })

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "items": items,
    }


@router.get("/monthly-summary")
def get_monthly_attendance_summary(
    month: Optional[int] = None,
    year: Optional[int] = None,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    today = date.today()
    m = month or today.month
    y = year or today.year

    start_date = date(y, m, 1)
    if m == 12:
        end_date = date(y + 1, 1, 1) - timedelta(days=1)
    else:
        end_date = date(y, m + 1, 1) - timedelta(days=1)

    daily_counts = (
        db.query(Attendance.attendance_date, func.count(Attendance.id))
        .filter(Attendance.attendance_date >= start_date, Attendance.attendance_date <= end_date)
        .group_by(Attendance.attendance_date)
        .order_by(Attendance.attendance_date.asc())
        .all()
    )

    total_in_month = sum(c[1] for c in daily_counts)

    return {
        "month": m,
        "year": y,
        "total_check_ins": total_in_month,
        "daily_breakdown": [
            {"date": d[0].isoformat(), "count": d[1]}
            for d in daily_counts
        ]
    }
