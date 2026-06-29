

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.modules.suppliers.model import Supplier
from app.modules.suppliers.repository import SupplierRepository
from app.modules.suppliers.schema import SupplierCreate, SupplierUpdate


class SupplierService:
    @staticmethod
    def list_suppliers(db: Session, skip: int = 0, limit: int = 100):
        return SupplierRepository.get_all(db, skip, limit)

    @staticmethod
    def get_supplier(db: Session, supplier_id: int):
        supplier = SupplierRepository.get_by_id(db, supplier_id)
        if supplier is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Proveedor no encontrado",
            )
        return supplier

    @staticmethod
    def create_supplier(db: Session, data: SupplierCreate):
        if SupplierRepository.get_by_name(db, data.name):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="El proveedor ya existe",
            )
        supplier = Supplier(**data.model_dump())
        return SupplierRepository.create(db, supplier)

    @staticmethod
    def update_supplier(db: Session, supplier_id: int, data: SupplierUpdate):
        supplier = SupplierService.get_supplier(db, supplier_id)
        update_data = data.model_dump(exclude_unset=True)
        if "name" in update_data:
            existing = SupplierRepository.get_by_name(db, update_data["name"])
            if existing is not None and existing.id != supplier.id:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="El proveedor ya existe",
                )
        for field, value in update_data.items():
            setattr(supplier, field, value)
        return SupplierRepository.update(db, supplier)

    @staticmethod
    def delete_supplier(db: Session, supplier_id: int):
        if not SupplierRepository.deactivate(db, supplier_id):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Proveedor no encontrado",
            )
        return {"message": "Proveedor eliminado correctamente"}
