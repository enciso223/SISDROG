from sqlalchemy.orm import Session
from app.modules.inventory.service import ProductService, CategoryService, SupplierService
from app.modules.inventory.schema import (
    ProductCreate, ProductUpdate,
    CategoryCreate,
    SupplierCreate, SupplierUpdate
)


class ProductController:

    def __init__(self):
        self.service = ProductService()

    def list(self, db: Session, skip: int = 0, limit: int = 100):
        return self.service.get_all(db, skip, limit)

    def get(self, db: Session, product_id: int):
        return self.service.get_by_id(db, product_id)

    def get_by_code(self, db: Session, code: str):
        return self.service.get_by_code(db, code)

    def search(self, db: Session, query: str):
        return self.service.search(db, query)

    def create(self, db: Session, data: ProductCreate):
        return self.service.create(db, data)

    def update(self, db: Session, product_id: int, data: ProductUpdate):
        return self.service.update(db, product_id, data)

    def delete(self, db: Session, product_id: int):
        return self.service.delete(db, product_id)

    def get_alerts(self, db: Session, expiry_days: int = 30):
        return self.service.get_alerts(db, expiry_days)


class CategoryController:

    def __init__(self):
        self.service = CategoryService()

    def list(self, db: Session):
        return self.service.get_all(db)

    def create(self, db: Session, data: CategoryCreate):
        return self.service.create(db, data)


class SupplierController:

    def __init__(self):
        self.service = SupplierService()

    def list(self, db: Session, skip: int = 0, limit: int = 100):
        return self.service.get_all(db, skip, limit)

    def get(self, db: Session, supplier_id: int):
        return self.service.get_by_id(db, supplier_id)

    def create(self, db: Session, data: SupplierCreate):
        return self.service.create(db, data)

    def update(self, db: Session, supplier_id: int, data: SupplierUpdate):
        return self.service.update(db, supplier_id, data)

