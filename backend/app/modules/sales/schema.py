from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class SaleItemCreate(BaseModel):
    product_id: int
    quantity: int


class SaleItemResponse(BaseModel):
    id: int
    product_id: int
    product_name: Optional[str] = None
    quantity: int
    unit_price: float
    subtotal: float

    class Config:
        from_attributes = True


class SaleCreate(BaseModel):
    items: List[SaleItemCreate]
    notes: Optional[str] = None


class SaleResponse(BaseModel):
    id: int
    total: float
    notes: Optional[str] = None
    created_at: datetime
    items: List[SaleItemResponse]

    class Config:
        from_attributes = True


# ─── Recibo ───────────────────────────────────────────────────
class ReceiptResponse(BaseModel):
    id: int
    sale_id: int
    receipt_number: str
    establishment_name: Optional[str] = None
    establishment_address: Optional[str] = None
    establishment_phone: Optional[str] = None
    created_at: datetime
    sale: SaleResponse

    class Config:
        from_attributes = True


# ─── Resumen de ventas (HU-04) ────────────────────────────────
class SalesSummaryResponse(BaseModel):
    total_sales: float
    transaction_count: int
    date_from: Optional[str] = None
    date_to: Optional[str] = None


