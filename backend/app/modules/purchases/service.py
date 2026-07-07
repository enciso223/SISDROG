from sqlalchemy.orm import Session
from fastapi import HTTPException
from datetime import date

from app.modules.purchases.model import Purchase
from app.modules.purchases.schema import PurchaseCreate
from app.modules.inventory.model import Product, ProductLot
from app.modules.inventory.repository import ProductRepository


class PurchaseService:

    def __init__(self):
        self.product_repo = ProductRepository()

    def list_purchases(self, db: Session, skip: int = 0, limit: int = 100):
        return db.query(Purchase).filter(Purchase.is_active == True).order_by(Purchase.purchase_date.desc()).offset(skip).limit(limit).all()

    def get_purchase(self, db: Session, purchase_id: int):
        purchase = db.query(Purchase).filter(Purchase.id == purchase_id).first()
        if not purchase or not purchase.is_active:
            raise HTTPException(status_code=404, detail="Compra no encontrada")
        return purchase

    def create_purchase(self, db: Session, data: PurchaseCreate):
        product = self.product_repo.get_by_id(db, data.product_id)
        if not product or not product.is_active:
            raise HTTPException(status_code=404, detail="Producto no encontrado")

        if data.expiry_date <= date.today():
            raise HTTPException(status_code=400, detail="La fecha de vencimiento debe ser futura")

        total_amount = round(data.quantity * data.unit_price, 2)

        purchase = Purchase(
            product_id=data.product_id,
            purchase_date=data.purchase_date,
            quantity=data.quantity,
            unit_price=data.unit_price,
            total_amount=total_amount,
            lot_number=data.lot_number,
            notes=data.notes
        )
        db.add(purchase)

        lot = ProductLot(
            product_id=data.product_id,
            lot_number=data.lot_number,
            purchase_date=data.purchase_date,
            expiry_date=data.expiry_date,
            stock=data.quantity
        )
        db.add(lot)

        product.stock += data.quantity

        db.commit()
        db.refresh(purchase)
        return purchase

    def delete_purchase(self, db: Session, purchase_id: int):
        purchase = self.get_purchase(db, purchase_id)
        purchase.is_active = False
        db.commit()
        db.refresh(purchase)
        return purchase
