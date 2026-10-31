from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import desc, or_
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.deps import get_current_user, get_current_admin
from app.models.notification import Notification
from app.models.user import User
from app.schemas.notification import (
    NotificationCreate,
    NotificationResponse,
    NotificationListResponse,
)

router = APIRouter(tags=["Notifications"])


@router.get("/notifications", response_model=NotificationListResponse)
def get_my_notifications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Customer gets notifications targeted to them OR gym-wide broadcast (user_id is None)
    notifs = (
        db.query(Notification)
        .filter(or_(Notification.user_id == current_user.id, Notification.user_id == None))
        .order_by(desc(Notification.created_at))
        .limit(30)
        .all()
    )

    unread_count = sum(1 for n in notifs if not n.is_read)

    items = [
        NotificationResponse(
            id=n.id,
            user_id=n.user_id,
            title=n.title,
            message=n.message,
            type=n.type,
            is_read=n.is_read,
            read_at=n.read_at,
            created_at=n.created_at,
        )
        for n in notifs
    ]

    return NotificationListResponse(unread_count=unread_count, items=items)


@router.patch("/notifications/{notification_id}/read")
def mark_notification_read(
    notification_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    notif = db.query(Notification).filter(Notification.id == notification_id).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")

    if notif.user_id is not None and notif.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Forbidden")

    notif.is_read = True
    notif.read_at = datetime.now(timezone.utc)
    db.commit()
    return {"message": "Notification marked as read"}


@router.post("/admin/notifications", response_model=NotificationResponse, status_code=status.HTTP_201_CREATED)
def admin_create_notification(
    notif_in: NotificationCreate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    if notif_in.user_id:
        user = db.query(User).filter(User.id == notif_in.user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="Target customer not found")

    new_notif = Notification(
        user_id=notif_in.user_id,
        title=notif_in.title,
        message=notif_in.message,
        type=notif_in.type,
        is_read=False,
    )
    db.add(new_notif)
    db.commit()
    db.refresh(new_notif)

    return NotificationResponse(
        id=new_notif.id,
        user_id=new_notif.user_id,
        title=new_notif.title,
        message=new_notif.message,
        type=new_notif.type,
        is_read=new_notif.is_read,
        read_at=new_notif.read_at,
        created_at=new_notif.created_at,
    )
