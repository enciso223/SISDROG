from sqlalchemy import (
    Boolean,
    Column,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.orm import relationship

from app.database.database import Base


class Donation(Base):
    __tablename__ = "donations"

    id = Column(Integer, primary_key=True, index=True)
    donation_type = Column(String(20), nullable=False, index=True)
    donor_or_recipient = Column(String(200), nullable=True)
    donation_date = Column(Date, nullable=False)
    notes = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    items = relationship(
        "DonationItem",
        back_populates="donation",
        cascade="all, delete-orphan",
    )


class DonationItem(Base):
    __tablename__ = "donation_items"

    id = Column(Integer, primary_key=True, index=True)
    donation_id = Column(Integer, ForeignKey("donations.id"), nullable=False, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False, index=True)
    quantity = Column(Integer, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    donation = relationship("Donation", back_populates="items")
    product = relationship("Product")


class ProductMovement(Base):
    __tablename__ = "product_movements"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False, index=True)
    movement_type = Column(String(30), nullable=False, index=True)
    quantity = Column(Integer, nullable=False)
    reference_id = Column(Integer, nullable=True, index=True)
    reference_type = Column(String(30), nullable=True)
    notes = Column(Text, nullable=True)
    movement_date = Column(DateTime, server_default=func.now(), nullable=False)

    product = relationship("Product")
