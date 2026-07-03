from pydantic import BaseModel, field_validator
from typing import Optional, List
from datetime import date, datetime


class DonationItemCreate(BaseModel):
    product_id: int
    quantity: int

    @field_validator("quantity")
    @classmethod
    def quantity_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError("La cantidad debe ser mayor a 0")
        return v


class DonationItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int

    class Config:
        from_attributes = True


class DonationCreate(BaseModel):
    donation_type: str
    donor_or_recipient: Optional[str] = None
    donation_date: date
    items: List[DonationItemCreate]
    notes: Optional[str] = None

    @field_validator("donation_type")
    @classmethod
    def validate_donation_type(cls, v):
        if v not in ("received", "delivered"):
            raise ValueError("donation_type debe ser 'received' o 'delivered'")
        return v

    @field_validator("items")
    @classmethod
    def items_not_empty(cls, v):
        if not v:
            raise ValueError("La donación debe contener al menos un producto")
        return v


class DonationResponse(BaseModel):
    id: int
    donation_type: str
    donor_or_recipient: Optional[str] = None
    donation_date: date
    notes: Optional[str] = None
    is_active: bool
    created_at: datetime
    items: List[DonationItemResponse]

    class Config:
        from_attributes = True


class DonationListResponse(BaseModel):
    id: int
    donation_type: str
    donor_or_recipient: Optional[str] = None
    donation_date: date
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class ProductMovementResponse(BaseModel):
    id: int
    product_id: int
    movement_type: str
    quantity: int
    reference_id: Optional[int] = None
    reference_type: Optional[str] = None
    notes: Optional[str] = None
    movement_date: datetime

    class Config:
        from_attributes = True
