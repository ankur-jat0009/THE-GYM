from typing import Optional, List, Dict
from datetime import date, datetime
from pydantic import BaseModel, Field, ConfigDict


class QRTokenResponse(BaseModel):
    user_id: str
    token_payload: str
    qr_data: Dict[str, str | int]
    generated_at: int
    expires_in_seconds: int = 3600  # Token valid/refresh window


class AttendanceScanRequest(BaseModel):
    qr_payload: str  # JSON string or encoded string from QR scanner
    method: str = "QR_SCAN"


class MemberCheckinRequest(BaseModel):
    qr_payload: str  # QR string scanned by member camera from the gym wall/desk QR


class AttendanceManualRequest(BaseModel):
    user_id: str
    attendance_date: Optional[date] = None
    notes: Optional[str] = "Manual check-in by admin"


class AttendanceResponse(BaseModel):
    id: str
    user_id: str
    user_name: Optional[str] = None
    attendance_date: date
    check_in_time: datetime
    method: str
    marked_by_name: Optional[str] = None
    notes: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class AttendanceCalendarDay(BaseModel):
    date_str: str  # YYYY-MM-DD
    day_of_month: int
    is_present: bool
    check_in_time: Optional[str] = None


class CustomerAttendanceOverview(BaseModel):
    current_month: str
    total_days_in_month: int
    present_days_count: int
    attendance_percentage: float
    streak_days: int
    calendar_matrix: List[AttendanceCalendarDay]
    recent_logs: List[AttendanceResponse]
