from sqlalchemy.orm import Session
from datetime import date
from app.modules.sales.service import SaleService
from app.modules.sales.schema import SaleCreate


class SaleController:

    def __init__(self):
        self.service = SaleService()

    def list(self, db: Session, skip: int = 0, limit: int = 100):
        return self.service.get_all(db, skip, limit)

    def get(self, db: Session, sale_id: int):
        return self.service.get_by_id(db, sale_id)

    def create(self, db: Session, data: SaleCreate):
        return self.service.create_sale(db, data)

    def get_summary(self, db: Session, date_from: date = None, date_to: date = None):
        return self.service.get_summary(db, date_from, date_to)

    def get_receipt(self, db: Session, sale_id: int):
        return self.service.get_receipt(db, sale_id)


