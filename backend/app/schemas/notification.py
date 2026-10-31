from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class NotificationCreate(BaseModel):
    user_id: Optional[str] = None  # None for broadcast to all customers
    title: str = Field(..., min_length=2, max_length=200)
    message: str
    type: str = Field("ANNOUNCEMENT", description="PAYMENT_REMINDER, EXPIRY_REMINDER, PAYMENT_RECEIVED, WORKOUT_ASSIGNED, ANNOUNCEMENT")


class NotificationResponse(BaseModel):
    id: str
    user_id: Optional[str] = None
    title: str
    message: str
    type: str
    is_read: bool
    read_at: Optional[datetime] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class NotificationListResponse(BaseModel):
    unread_count: int
    items: List[NotificationResponse]
