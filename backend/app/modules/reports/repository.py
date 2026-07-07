from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from datetime import date
from typing import Optional

from app.modules.sales.model import Sale, SaleItem
from app.modules.expenses.model import Expense
from app.modules.purchases.model import Purchase
from app.modules.inventory.model import Product


class ReportsRepository:

    # ─── HU-10: Historial de compras ─────────────────────────
    def get_purchase_history(
        self,
        db: Session,
        skip: int = 0,
        limit: int = 100,
        date_from: Optional[date] = None,
        date_to: Optional[date] = None,
        product_id: Optional[int] = None
    ):
        query = (
            db.query(Purchase, Product.name.label("product_name"))
            .join(Product, Purchase.product_id == Product.id)
            .filter(Purchase.is_active == True)
        )
        if date_from:
            query = query.filter(Purchase.purchase_date >= date_from)
        if date_to:
            query = query.filter(Purchase.purchase_date <= date_to)
        if product_id:
            query = query.filter(Purchase.product_id == product_id)
        return query.order_by(Purchase.purchase_date.desc()).offset(skip).limit(limit).all()

    # ─── HU-12: Balance financiero ───────────────────────────
    def get_total_sales(self, db: Session, date_from: Optional[date], date_to: Optional[date]) -> float:
        query = db.query(func.coalesce(func.sum(Sale.total), 0))
        if date_from:
            query = query.filter(func.date(Sale.created_at) >= date_from)
        if date_to:
            query = query.filter(func.date(Sale.created_at) <= date_to)
        return float(query.scalar())

    def get_total_expenses(self, db: Session, date_from: Optional[date], date_to: Optional[date]) -> float:
        query = db.query(func.coalesce(func.sum(Expense.amount), 0)).filter(Expense.is_active == True)
        if date_from:
            query = query.filter(Expense.expense_date >= date_from)
        if date_to:
            query = query.filter(Expense.expense_date <= date_to)
        return float(query.scalar())

    def get_total_purchases(self, db: Session, date_from: Optional[date], date_to: Optional[date]) -> float:
        query = db.query(func.coalesce(func.sum(Purchase.total_amount), 0)).filter(Purchase.is_active == True)
        if date_from:
            query = query.filter(Purchase.purchase_date >= date_from)
        if date_to:
            query = query.filter(Purchase.purchase_date <= date_to)
        return float(query.scalar())

    # ─── HU-13: Reporte de ventas ────────────────────────────
    def get_sales_report(self, db: Session, date_from: Optional[date], date_to: Optional[date]):
        query = db.query(
            func.coalesce(func.sum(Sale.total), 0).label("total_sales"),
            func.count(Sale.id).label("transaction_count")
        )
        if date_from:
            query = query.filter(func.date(Sale.created_at) >= date_from)
        if date_to:
            query = query.filter(func.date(Sale.created_at) <= date_to)
        return query.first()

    # ─── HU-14: Productos más vendidos ───────────────────────
    def get_top_products(
        self,
        db: Session,
        limit: int = 10,
        date_from: Optional[date] = None,
        date_to: Optional[date] = None
    ):
        query = (
            db.query(
                Product.id.label("product_id"),
                Product.name.label("product_name"),
                func.sum(SaleItem.quantity).label("total_quantity"),
                func.sum(SaleItem.subtotal).label("total_revenue")
            )
            .join(SaleItem, Product.id == SaleItem.product_id)
            .join(Sale, SaleItem.sale_id == Sale.id)
        )
        if date_from:
            query = query.filter(func.date(Sale.created_at) >= date_from)
        if date_to:
            query = query.filter(func.date(Sale.created_at) <= date_to)
        return (
            query
            .group_by(Product.id, Product.name)
            .order_by(desc("total_quantity"))
            .limit(limit)
            .all()
        )

    # ─── HU-15: Valor del inventario ─────────────────────────
    def get_inventory_value(self, db: Session):
        return db.query(Product).filter(Product.is_active == True).all()
