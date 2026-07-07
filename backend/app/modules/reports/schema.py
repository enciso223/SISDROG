from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime


# ─── HU-10: Historial de compras ─────────────────────────────
class PurchaseHistoryItem(BaseModel):
    id: int
    supplier_id: int
    supplier_name: str
    purchase_date: date
    total_amount: float
    notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ─── HU-12: Balance financiero ───────────────────────────────
class FinancialBalanceResponse(BaseModel):
    total_sales: float
    total_expenses: float
    total_purchases: float
    net_profit: float
    date_from: Optional[str] = None
    date_to: Optional[str] = None


# ─── HU-13: Reporte de ventas ────────────────────────────────
class SalesReportResponse(BaseModel):
    total_sales: float
    transaction_count: int
    average_daily: float
    date_from: Optional[str] = None
    date_to: Optional[str] = None


# ─── HU-14: Productos más vendidos ───────────────────────────
class TopProductItem(BaseModel):
    product_id: int
    product_name: str
    total_quantity: int
    total_revenue: float


class TopProductsResponse(BaseModel):
    products: List[TopProductItem]
    date_from: Optional[str] = None
    date_to: Optional[str] = None


# ─── HU-15: Valor del inventario ─────────────────────────────
class InventoryValueItem(BaseModel):
    product_id: int
    product_name: str
    stock: int
    purchase_price: float
    sale_price: float
    purchase_value: float
    sale_value: float


class InventoryValueResponse(BaseModel):
    products: List[InventoryValueItem]
    total_purchase_value: float
    total_sale_value: float
    potential_profit: float
