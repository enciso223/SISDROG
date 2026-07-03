from sqlalchemy.orm import Session, joinedload
from app.modules.purchases.model import Purchase, PurchaseItem


class PurchaseRepository:

    def get_all(self, db: Session, skip: int = 0, limit: int = 100):
        return (
            db.query(Purchase)
            .filter(Purchase.is_active == True)
            .order_by(Purchase.purchase_date.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_by_id(self, db: Session, purchase_id: int):
        return (
            db.query(Purchase)
            .options(joinedload(Purchase.items))
            .filter(Purchase.id == purchase_id)
            .first()
        )

    def create_purchase(self, db: Session, purchase: Purchase):
        db.add(purchase)
        return purchase

    def create_item(self, db: Session, item: PurchaseItem):
        db.add(item)
        return item

    def deactivate(self, db: Session, purchase: Purchase):
        purchase.is_active = False
        db.commit()
        db.refresh(purchase)
        return purchase
