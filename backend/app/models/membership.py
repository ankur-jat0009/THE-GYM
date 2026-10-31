import uuid
import json
from sqlalchemy import Column, String, Integer, Numeric, Boolean, Text, Date, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.core.database import Base


class MembershipPlan(Base):
    __tablename__ = "membership_plans"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False)
    duration_months = Column(Integer, nullable=False, default=1)
    duration_days = Column(Integer, nullable=False, default=30)
    price = Column(Numeric(10, 2), nullable=False)
    description = Column(Text, nullable=True)
    features_json = Column("features", Text, nullable=False, default="[]")  # Stored as JSON string
    is_popular = Column(Boolean, nullable=False, default=False)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    @property
    def features(self):
        try:
            return json.loads(self.features_json)
        except Exception:
            return []

    @features.setter
    def features(self, val):
        if isinstance(val, list):
            self.features_json = json.dumps(val)
        elif isinstance(val, str):
            self.features_json = val
        else:
            self.features_json = "[]"


class Membership(Base):
    __tablename__ = "memberships"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    plan_id = Column(String(36), ForeignKey("membership_plans.id"), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    total_amount = Column(Numeric(10, 2), nullable=False)
    discount_amount = Column(Numeric(10, 2), nullable=False, default=0.0)
    final_amount = Column(Numeric(10, 2), nullable=False)
    status = Column(String(20), nullable=False, default="active")  # active, expired, cancelled, pending
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    user = relationship("User", back_populates="memberships")
    plan = relationship("MembershipPlan")
    payments = relationship("Payment", back_populates="membership", cascade="all, delete-orphan", order_by="desc(Payment.payment_date)")
