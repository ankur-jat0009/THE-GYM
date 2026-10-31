import uuid
from sqlalchemy import Column, String, Date, DateTime, ForeignKey, Text, UniqueConstraint, func
from sqlalchemy.orm import relationship
from app.core.database import Base


class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    attendance_date = Column(Date, nullable=False, index=True)
    check_in_time = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    marked_by_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    method = Column(String(20), nullable=False, default="QR_SCAN")  # QR_SCAN, MANUAL
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (
        UniqueConstraint("user_id", "attendance_date", name="uq_user_daily_attendance"),
    )

    # Relationships
    user = relationship("User", back_populates="attendance_records", foreign_keys=[user_id])
    marked_by = relationship("User", foreign_keys=[marked_by_id])
