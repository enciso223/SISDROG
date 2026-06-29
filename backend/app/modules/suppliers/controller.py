from sqlalchemy.orm import Session

from app.modules.suppliers.schema import SupplierCreate, SupplierUpdate
from app.modules.suppliers.service import SupplierService


class SupplierController:
    @staticmethod
    def list_suppliers(db: Session, skip: int = 0, limit: int = 100):
        return SupplierService.list_suppliers(db, skip, limit)

    @staticmethod
    def get_supplier(db: Session, supplier_id: int):
        return SupplierService.get_supplier(db, supplier_id)

    @staticmethod
    def create_supplier(db: Session, data: SupplierCreate):
        return SupplierService.create_supplier(db, data)

    @staticmethod
    def update_supplier(db: Session, supplier_id: int, data: SupplierUpdate):
        return SupplierService.update_supplier(db, supplier_id, data)

    @staticmethod
    def delete_supplier(db: Session, supplier_id: int):
        return SupplierService.delete_supplier(db, supplier_id)
