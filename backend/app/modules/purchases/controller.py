from sqlalchemy.orm import Session

from app.modules.purchases.schema import PurchaseCreate
from app.modules.purchases.service import PurchaseService


class PurchaseController:
    @staticmethod
    def list_purchases(db: Session, skip: int = 0, limit: int = 100):
        return PurchaseService.list_purchases(db, skip, limit)

    @staticmethod
    def get_purchase(db: Session, purchase_id: int):
        return PurchaseService.get_purchase(db, purchase_id)

    @staticmethod
    def create_purchase(db: Session, data: PurchaseCreate):
        return PurchaseService.create_purchase(db, data)

    @staticmethod
    def delete_purchase(db: Session, purchase_id: int):
        return PurchaseService.delete_purchase(db, purchase_id)
