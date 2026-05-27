from pydantic import BaseModel
from typing import Optional
from datetime import date


# ─── Category ────────────────────────────────────────────────
class CategoryCreate(BaseModel):
    name: str
    description: Optional[str] = None


class CategoryResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None

    class Config:
        from_attributes = True


# ─── Supplier ────────────────────────────────────────────────
class SupplierCreate(BaseModel):
    name: str
    contact: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None


class SupplierUpdate(BaseModel):
    name: Optional[str] = None
    contact: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    is_active: Optional[bool] = None


class SupplierResponse(BaseModel):
    id: int
    name: str
    contact: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    is_active: bool

    class Config:
        from_attributes = True


# ─── Product ─────────────────────────────────────────────────
class ProductCreate(BaseModel):
    code: str
    name: str
    description: Optional[str] = None
    presentation: Optional[str] = None
    laboratory: Optional[str] = None
    purchase_price: float
    sale_price: float
    batch: Optional[str] = None
    expiry_date: Optional[date] = None
    stock: int = 0
    min_stock: int = 5
    category_id: Optional[int] = None
    supplier_id: Optional[int] = None


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    presentation: Optional[str] = None
    laboratory: Optional[str] = None
    purchase_price: Optional[float] = None
    sale_price: Optional[float] = None
    batch: Optional[str] = None
    expiry_date: Optional[date] = None
    min_stock: Optional[int] = None
    category_id: Optional[int] = None
    supplier_id: Optional[int] = None
    is_active: Optional[bool] = None


class ProductResponse(BaseModel):
    id: int
    code: str
    name: str
    description: Optional[str] = None
    presentation: Optional[str] = None
    laboratory: Optional[str] = None
    purchase_price: float
    sale_price: float
    batch: Optional[str] = None
    expiry_date: Optional[date] = None
    stock: int
    min_stock: int
    is_active: bool
    category_id: Optional[int] = None
    supplier_id: Optional[int] = None

    class Config:
        from_attributes = True


# ─── Alerts ──────────────────────────────────────────────────
class StockAlertResponse(BaseModel):
    low_stock: list[ProductResponse]
    expiring_soon: list[ProductResponse]


