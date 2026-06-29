from datetime import date, datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator


class PurchaseItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(gt=0)
    unit_price: Decimal = Field(gt=0)


class PurchaseItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    unit_price: Decimal
    subtotal: Decimal

    model_config = ConfigDict(from_attributes=True)


class PurchaseCreate(BaseModel):
    supplier_id: int
    purchase_date: date
    items: list[PurchaseItemCreate]
    notes: Optional[str] = None

    @field_validator("items")
    @classmethod
    def validate_items(cls, value: list[PurchaseItemCreate]):
        if not value:
            raise ValueError("La compra debe tener al menos un ítem")
        return value


class PurchaseResponse(BaseModel):
    id: int
    supplier_id: int
    purchase_date: date
    total_amount: Decimal
    notes: Optional[str]
    is_active: bool
    created_at: datetime
    items: list[PurchaseItemResponse]

    model_config = ConfigDict(from_attributes=True)


class PurchaseListResponse(BaseModel):
    id: int
    supplier_id: int
    purchase_date: date
    total_amount: Decimal
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
