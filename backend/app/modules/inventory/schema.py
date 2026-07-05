from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import date


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


# ─── Supplier ────────────────────────────────────────────────
class SupplierCreate(BaseModel):
    name: str
    contact: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None

    @field_validator("name")
    @classmethod
    def name_not_empty(cls, v):
        if not v.strip():
            raise ValueError("El nombre del proveedor no puede estar vacío")
        return v.strip()


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

    @field_validator("min_stock")
    @classmethod
    def min_stock_not_negative(cls, v):
        if v < 0:
            raise ValueError("El stock mínimo no puede ser negativo")
        return v


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    presentation: Optional[str] = None
    laboratory: Optional[str] = None
    purchase_price: Optional[float] = None
    sale_price: Optional[float] = None
    batch: Optional[str] = None
    expiry_date: Optional[date] = None
    stock: Optional[int] = None
    min_stock: Optional[int] = None
    category_id: Optional[int] = None
    supplier_id: Optional[int] = None
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
