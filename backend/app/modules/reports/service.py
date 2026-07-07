from sqlalchemy.orm import Session
from fastapi import HTTPException
from datetime import date, timedelta
from typing import Optional

from app.modules.reports.repository import ReportsRepository


class ReportsService:

    def __init__(self):
        self.repo = ReportsRepository()

    def _validate_dates(self, date_from: Optional[date], date_to: Optional[date]):
        if date_from and date_to and date_from > date_to:
            raise HTTPException(
                status_code=400,
                detail="El rango de fechas no es válido"
            )

    # ─── HU-10: Historial de compras ─────────────────────────
    def get_purchase_history(
        self,
        db: Session,
        skip: int = 0,
        limit: int = 100,
        date_from: Optional[date] = None,
        date_to: Optional[date] = None,
        supplier_id: Optional[int] = None
    ):
        self._validate_dates(date_from, date_to)
        results = self.repo.get_purchase_history(db, skip, limit, date_from, date_to, supplier_id)
        return [
            {
                "id": purchase.id,
                "supplier_id": purchase.supplier_id,
                "supplier_name": supplier_name,
                "purchase_date": purchase.purchase_date,
                "total_amount": purchase.total_amount,
                "notes": purchase.notes,
                "created_at": purchase.created_at
            }
            for purchase, supplier_name in results
        ]

    # ─── HU-12: Balance financiero ───────────────────────────
    def get_financial_balance(
        self,
        db: Session,
        date_from: Optional[date] = None,
        date_to: Optional[date] = None
    ):
        self._validate_dates(date_from, date_to)
        total_sales = self.repo.get_total_sales(db, date_from, date_to)
        total_expenses = self.repo.get_total_expenses(db, date_from, date_to)
        total_purchases = self.repo.get_total_purchases(db, date_from, date_to)
        net_profit = total_sales - total_expenses - total_purchases
        return {
            "total_sales": round(total_sales, 2),
            "total_expenses": round(total_expenses, 2),
            "total_purchases": round(total_purchases, 2),
            "net_profit": round(net_profit, 2),
            "date_from": str(date_from) if date_from else None,
            "date_to": str(date_to) if date_to else None
        }

    # ─── HU-13: Reporte de ventas ────────────────────────────
    def get_sales_report(
        self,
        db: Session,
        date_from: Optional[date] = None,
        date_to: Optional[date] = None
    ):
        self._validate_dates(date_from, date_to)
        result = self.repo.get_sales_report(db, date_from, date_to)
        total_sales = float(result.total_sales)
        transaction_count = result.transaction_count

        if date_from and date_to:
            days = (date_to - date_from).days + 1
        else:
            days = 1

        average_daily = round(total_sales / days, 2) if days > 0 and total_sales > 0 else 0.0

        return {
            "total_sales": round(total_sales, 2),
            "transaction_count": transaction_count,
            "average_daily": average_daily,
            "date_from": str(date_from) if date_from else None,
            "date_to": str(date_to) if date_to else None
        }

    # ─── HU-14: Productos más vendidos ───────────────────────
    def get_top_products(
        self,
        db: Session,
        limit: int = 10,
        date_from: Optional[date] = None,
        date_to: Optional[date] = None
    ):
        self._validate_dates(date_from, date_to)
        results = self.repo.get_top_products(db, limit, date_from, date_to)
        return {
            "products": [
                {
                    "product_id": r.product_id,
                    "product_name": r.product_name,
                    "total_quantity": r.total_quantity,
                    "total_revenue": round(float(r.total_revenue), 2)
                }
                for r in results
            ],
            "date_from": str(date_from) if date_from else None,
            "date_to": str(date_to) if date_to else None
        }

    # ─── HU-15: Valor del inventario ─────────────────────────
    def get_inventory_value(self, db: Session):
        products = self.repo.get_inventory_value(db)
        items = []
        total_purchase_value = 0.0
        total_sale_value = 0.0

        for p in products:
            purchase_value = round(p.purchase_price * p.stock, 2)
            sale_value = round(p.sale_price * p.stock, 2)
            total_purchase_value += purchase_value
            total_sale_value += sale_value
            items.append({
                "product_id": p.id,
                "product_name": p.name,
                "stock": p.stock,
                "purchase_price": p.purchase_price,
                "sale_price": p.sale_price,
                "purchase_value": purchase_value,
                "sale_value": sale_value
            })

        return {
            "products": items,
            "total_purchase_value": round(total_purchase_value, 2),
            "total_sale_value": round(total_sale_value, 2),
            "potential_profit": round(total_sale_value - total_purchase_value, 2)
        }
