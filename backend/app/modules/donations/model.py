from sqlalchemy import Column, Integer, String, Date, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.database import Base


class Donation(Base):
    __tablename__ = "donations"

    id = Column(Integer, primary_key=True, index=True)
    donation_type = Column(String(20), nullable=False)
    donor_or_recipient = Column(String(200), nullable=True)
    donation_date = Column(Date, nullable=False)
    notes = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    items = relationship("DonationItem", back_populates="donation", cascade="all, delete-orphan")


class DonationItem(Base):
    __tablename__ = "donation_items"

    id = Column(Integer, primary_key=True, index=True)
    donation_id = Column(Integer, ForeignKey("donations.id"), nullable=False, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False, index=True)
    quantity = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    donation = relationship("Donation", back_populates="items")
    product = relationship("Product")


class ProductMovement(Base):
    __tablename__ = "product_movements"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False, index=True)
    movement_type = Column(String(30), nullable=False)
    quantity = Column(Integer, nullable=False)
    reference_id = Column(Integer, nullable=True)
    reference_type = Column(String(30), nullable=True)
    notes = Column(Text, nullable=True)
    movement_date = Column(DateTime(timezone=True), server_default=func.now())

    product = relationship("Product")
