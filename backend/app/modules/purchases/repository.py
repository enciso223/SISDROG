from sqlalchemy.orm import Session, selectinload

from app.modules.purchases.model import Purchase, PurchaseItem


class PurchaseRepository:
    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> list[Purchase]:
        return (
            db.query(Purchase)
            .options(selectinload(Purchase.items))
            .filter(Purchase.is_active.is_(True))
            .order_by(Purchase.purchase_date.desc(), Purchase.id.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    @staticmethod
    def get_by_id(db: Session, purchase_id: int) -> Purchase | None:
        return (
            db.query(Purchase)
            .options(selectinload(Purchase.items))
            .filter(Purchase.id == purchase_id, Purchase.is_active.is_(True))
            .first()
        )

    @staticmethod
    def create_purchase(db: Session, purchase: Purchase) -> Purchase:
        db.add(purchase)
        db.flush()
        return purchase

    @staticmethod
    def create_item(db: Session, item: PurchaseItem) -> PurchaseItem:
        db.add(item)
        db.flush()
        return item

    @staticmethod
    def deactivate(db: Session, purchase_id: int) -> bool:
        purchase = PurchaseRepository.get_by_id(db, purchase_id)
        if purchase is None:
            return False
        purchase.is_active = False
        db.add(purchase)
        db.commit()
        return True
