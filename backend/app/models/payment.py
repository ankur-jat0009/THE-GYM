import uuid
from sqlalchemy import Column, String, Numeric, Date, DateTime, ForeignKey, Text, func
from sqlalchemy.orm import relationship
from app.core.database import Base


class Payment(Base):
    __tablename__ = "payments"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    membership_id = Column(String(36), ForeignKey("memberships.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    amount = Column(Numeric(10, 2), nullable=False)
    payment_date = Column(Date, nullable=False)
    payment_method = Column(String(30), nullable=False, default="UPI")  # CASH, UPI, BANK_TRANSFER, OTHER
    transaction_reference = Column(String(100), nullable=True)
    receipt_number = Column(String(50), unique=True, index=True, nullable=False)
    remarks = Column(Text, nullable=True)
    created_by_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationships
    membership = relationship("Membership", back_populates="payments")
    user = relationship("User", back_populates="payments", foreign_keys=[user_id])
    created_by = relationship("User", foreign_keys=[created_by_id])
