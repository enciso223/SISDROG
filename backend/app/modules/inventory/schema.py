from pydantic import BaseModel, field_validator
from typing import Optional, List
from datetime import date, datetime


# ─── Category ────────────────────────────────────────────────
class CategoryCreate(BaseModel):
    name: str
    description: Optional[str] = None

    @field_validator("name")
    @classmethod
    def name_not_empty(cls, v):
        if not v.strip():
            raise ValueError("El nombre no puede estar vacío")
        return v.strip()


class CategoryResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None

    class Config:
        from_attributes = True


# ─── ProductLot ──────────────────────────────────────────────
class ProductLotCreate(BaseModel):
    lot_number: str
    purchase_date: date
    expiry_date: date
    stock: int

    @field_validator("stock")
    @classmethod
    def stock_positive(cls, v):
        if v <= 0:
            raise ValueError("El stock del lote debe ser mayor a 0")
        return v

    @field_validator("lot_number")
    @classmethod
    def lot_number_not_empty(cls, v):
        if not v.strip():
            raise ValueError("El número de lote no puede estar vacío")
        return v.strip()


class ProductLotResponse(BaseModel):
    id: int
    product_id: int
    lot_number: str
    purchase_date: date
    expiry_date: date
    stock: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Product ─────────────────────────────────────────────────
class ProductCreate(BaseModel):
    code: str
    name: str
    description: Optional[str] = None
    presentation: Optional[str] = None
    gramaje: Optional[str] = None
    laboratory: Optional[str] = None
    purchase_price: float
    sale_price: float
    stock: int = 0
    min_stock: int = 5
    category_id: Optional[int] = None
    supplier_name: Optional[str] = None
    contact_name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    lots: Optional[List[ProductLotCreate]] = None

    @field_validator("name")
    @classmethod
    def name_not_empty(cls, v):
        if not v.strip():
            raise ValueError("El nombre del producto no puede estar vacío")
        return v.strip()

    @field_validator("purchase_price")
    @classmethod
    def purchase_price_positive(cls, v):
        if v <= 0:
            raise ValueError("El precio de compra debe ser mayor a 0")
        return v

    @field_validator("sale_price")
    @classmethod
    def sale_price_positive(cls, v):
        if v <= 0:
            raise ValueError("El precio de venta debe ser mayor a 0")
        return v

    @field_validator("stock")
    @classmethod
    def stock_not_negative(cls, v):
        if v < 0:
            raise ValueError("El stock no puede ser negativo")
        return v


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    presentation: Optional[str] = None
    gramaje: Optional[str] = None
    laboratory: Optional[str] = None
    purchase_price: Optional[float] = None
    sale_price: Optional[float] = None
    min_stock: Optional[int] = None
    category_id: Optional[int] = None
    supplier_name: Optional[str] = None
    contact_name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    is_active: Optional[bool] = None

    @field_validator("purchase_price")
    @classmethod
    def purchase_price_positive(cls, v):
        if v is not None and v <= 0:
            raise ValueError("El precio de compra debe ser mayor a 0")
        return v

    @field_validator("sale_price")
    @classmethod
    def sale_price_positive(cls, v):
        if v is not None and v <= 0:
            raise ValueError("El precio de venta debe ser mayor a 0")
        return v


class ProductResponse(BaseModel):
    id: int
    code: str
    name: str
    description: Optional[str] = None
    presentation: Optional[str] = None
    gramaje: Optional[str] = None
    laboratory: Optional[str] = None
    purchase_price: float
    sale_price: float
    stock: int
    min_stock: int
    is_active: bool
    category_id: Optional[int] = None
    supplier_name: Optional[str] = None
    contact_name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    lots: List[ProductLotResponse] = []

    class Config:
        from_attributes = True


# ─── Alerts ──────────────────────────────────────────────────
class LotAlertResponse(BaseModel):
    lot_id: int
    product_id: int
    product_name: str
    lot_number: str
    expiry_date: date
    days_until_expiry: int
    stock: int

    class Config:
        from_attributes = True


class StockAlertResponse(BaseModel):
    low_stock: List[ProductResponse]
    expiring_soon: List[LotAlertResponse]
