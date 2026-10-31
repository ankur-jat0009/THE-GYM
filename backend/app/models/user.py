import uuid
from sqlalchemy import Column, String, Boolean, Date, DateTime, func
from sqlalchemy.orm import relationship
from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    full_name = Column(String(120), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone = Column(String(20), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False, default="customer")  # customer, admin, staff
    is_active = Column(Boolean, nullable=False, default=True)
    gender = Column(String(20), nullable=True)
    date_of_birth = Column(Date, nullable=True)
    qr_token_salt = Column(String(64), nullable=False, default=lambda: uuid.uuid4().hex)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    memberships = relationship("Membership", back_populates="user", cascade="all, delete-orphan", order_by="desc(Membership.created_at)")
    payments = relationship("Payment", back_populates="user", cascade="all, delete-orphan", foreign_keys="Payment.user_id", order_by="desc(Payment.payment_date)")
    attendance_records = relationship("Attendance", back_populates="user", cascade="all, delete-orphan", foreign_keys="Attendance.user_id", order_by="desc(Attendance.attendance_date)")
    workout_assignments = relationship("CustomerWorkoutAssignment", back_populates="user", cascade="all, delete-orphan", order_by="desc(CustomerWorkoutAssignment.assigned_at)")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan", order_by="desc(Notification.created_at)")
