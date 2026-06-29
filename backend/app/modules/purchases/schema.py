from pydantic import BaseModel, field_validator
from typing import Optional, List
from datetime import date, datetime


class PurchaseItemCreate(BaseModel):
    product_id: int
    quantity: int
    unit_price: float

    @field_validator("quantity")
    @classmethod
    def quantity_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError("La cantidad debe ser mayor a 0")
        return v

    @field_validator("unit_price")
    @classmethod
    def unit_price_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError("El precio unitario debe ser mayor a 0")
        return v


class PurchaseItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    unit_price: float
    subtotal: float

    class Config:
        from_attributes = True


class PurchaseCreate(BaseModel):
    supplier_id: int
    purchase_date: date
    items: List[PurchaseItemCreate]
    notes: Optional[str] = None

    @field_validator("items")
    @classmethod
    def items_not_empty(cls, v):
        if not v:
            raise ValueError("La compra debe contener al menos un producto")
        return v


class PurchaseResponse(BaseModel):
    id: int
    supplier_id: int
    purchase_date: date
    total_amount: float
    notes: Optional[str] = None
    is_active: bool
    created_at: datetime
    items: List[PurchaseItemResponse]

    class Config:
        from_attributes = True


class PurchaseListResponse(BaseModel):
    id: int
    supplier_id: int
    purchase_date: date
    total_amount: float
    created_at: datetime

    class Config:
        from_attributes = True
