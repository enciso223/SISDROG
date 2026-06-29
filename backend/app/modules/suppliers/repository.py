

from sqlalchemy.orm import Session

from app.modules.suppliers.model import Supplier


class SupplierRepository:
    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> list[Supplier]:
        return (
            db.query(Supplier)
            .filter(Supplier.is_active.is_(True))
            .offset(skip)
            .limit(limit)
            .all()
        )

    @staticmethod
    def get_by_id(db: Session, supplier_id: int) -> Supplier | None:
        return (
            db.query(Supplier)
            .filter(Supplier.id == supplier_id, Supplier.is_active.is_(True))
            .first()
        )

    @staticmethod
    def get_by_name(db: Session, name: str) -> Supplier | None:
        return (
            db.query(Supplier)
            .filter(Supplier.name == name, Supplier.is_active.is_(True))
            .first()
        )

    @staticmethod
    def create(db: Session, supplier: Supplier) -> Supplier:
        db.add(supplier)
        db.commit()
        db.refresh(supplier)
        return supplier

    @staticmethod
    def update(db: Session, supplier: Supplier) -> Supplier:
        db.add(supplier)
        db.commit()
        db.refresh(supplier)
        return supplier

    @staticmethod
    def deactivate(db: Session, supplier_id: int) -> bool:
        supplier = SupplierRepository.get_by_id(db, supplier_id)
        if supplier is None:
            return False
        supplier.is_active = False
        db.add(supplier)
        db.commit()
        return True
