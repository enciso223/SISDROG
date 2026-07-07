from sqlalchemy.orm import Session
from app.modules.purchases.service import PurchaseService
from app.modules.purchases.schema import PurchaseCreate


class PurchaseController:

    def __init__(self):
        self.service = PurchaseService()

    def list(self, db: Session, skip: int = 0, limit: int = 100):
        return self.service.list_purchases(db, skip, limit)

    def get(self, db: Session, purchase_id: int):
        return self.service.get_purchase(db, purchase_id)

    def create(self, db: Session, data: PurchaseCreate):
        return self.service.create_purchase(db, data)

    def delete(self, db: Session, purchase_id: int):
        return self.service.delete_purchase(db, purchase_id)
