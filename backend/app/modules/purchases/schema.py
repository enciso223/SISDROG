from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import date, datetime


class PurchaseCreate(BaseModel):
    product_id: int
    purchase_date: date
    quantity: int
    unit_price: float
    lot_number: str
    expiry_date: date
    notes: Optional[str] = None

    @field_validator("quantity")
    @classmethod
    def quantity_positive(cls, v):
        if v <= 0:
            raise ValueError("La cantidad debe ser mayor a 0")
        return v

    @field_validator("unit_price")
    @classmethod
    def price_positive(cls, v):
        if v <= 0:
            raise ValueError("El precio debe ser mayor a 0")
        return v


class PurchaseResponse(BaseModel):
    id: int
    product_id: int
    purchase_date: date
    quantity: int
    unit_price: float
    total_amount: float
    lot_number: Optional[str] = None
    notes: Optional[str] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
