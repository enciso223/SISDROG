from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator


class DonationItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(gt=0)


class DonationItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int

    model_config = ConfigDict(from_attributes=True)


class DonationCreate(BaseModel):
    donation_type: str
    donor_or_recipient: Optional[str] = None
    donation_date: date
    items: list[DonationItemCreate]
    notes: Optional[str] = None

    @field_validator("donation_type")
    @classmethod
    def validate_donation_type(cls, value: str):
        if value not in {"received", "delivered"}:
            raise ValueError('donation_type debe ser "received" o "delivered"')
        return value

    @field_validator("items")
    @classmethod
    def validate_items(cls, value: list[DonationItemCreate]):
        if not value:
            raise ValueError("La donación debe tener al menos un ítem")
        return value


class DonationResponse(BaseModel):
    id: int
    donation_type: str
    donor_or_recipient: Optional[str]
    donation_date: date
    notes: Optional[str]
    is_active: bool
    created_at: datetime
    items: list[DonationItemResponse]

    model_config = ConfigDict(from_attributes=True)


class ProductMovementResponse(BaseModel):
    id: int
    product_id: int
    movement_type: str
    quantity: int
    reference_id: Optional[int]
    reference_type: Optional[str]
    movement_date: datetime

    model_config = ConfigDict(from_attributes=True)
