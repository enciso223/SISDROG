

from datetime import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class ProductCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    sku: Optional[str] = None
    quantity: int = Field(default=0, ge=0)
    unit_price: Decimal = Field(default=Decimal("0"), ge=0)


class ProductResponse(BaseModel):
    id: int
    name: str
    sku: Optional[str]
    quantity: int
    unit_price: Decimal
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
