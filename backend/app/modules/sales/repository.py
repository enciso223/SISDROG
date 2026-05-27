from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date
from app.modules.sales.model import Sale, SaleItem, SaleReceipt


class SaleRepository:

    def get_all(self, db: Session, skip: int = 0, limit: int = 100):
        return db.query(Sale).order_by(Sale.created_at.desc()).offset(skip).limit(limit).all()

    def get_by_id(self, db: Session, sale_id: int):
        return db.query(Sale).filter(Sale.id == sale_id).first()

    def create(self, db: Session, sale: Sale):
        db.add(sale)
        db.commit()
        db.refresh(sale)
        return sale

    def get_summary(self, db: Session, date_from: date = None, date_to: date = None):
        """HU-04: resumen de ventas filtrado por fecha"""
        query = db.query(
            func.coalesce(func.sum(Sale.total), 0).label("total_sales"),
            func.count(Sale.id).label("transaction_count")
        )
        if date_from:
            query = query.filter(func.date(Sale.created_at) >= date_from)
        if date_to:
            query = query.filter(func.date(Sale.created_at) <= date_to)
        return query.first()


class SaleReceiptRepository:

    def get_by_sale_id(self, db: Session, sale_id: int):
        return db.query(SaleReceipt).filter(SaleReceipt.sale_id == sale_id).first()

    def get_by_receipt_number(self, db: Session, receipt_number: str):
        return db.query(SaleReceipt).filter(SaleReceipt.receipt_number == receipt_number).first()

    def create(self, db: Session, receipt: SaleReceipt):
        db.add(receipt)
        db.commit()
        db.refresh(receipt)
        return receipt


