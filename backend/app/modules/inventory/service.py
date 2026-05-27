from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.modules.inventory.repository import ProductRepository, CategoryRepository, SupplierRepository
from app.modules.inventory.model import Product, Category, Supplier
from app.modules.inventory.schema import ProductCreate, ProductUpdate, CategoryCreate, SupplierCreate, SupplierUpdate


class CategoryService:

    def __init__(self):
        self.repo = CategoryRepository()

    def get_all(self, db: Session):
        return self.repo.get_all(db)

    def create(self, db: Session, data: CategoryCreate):
        category = Category(**data.model_dump())
        return self.repo.create(db, category)


class SupplierService:

    def __init__(self):
        self.repo = SupplierRepository()

    def get_all(self, db: Session, skip: int = 0, limit: int = 100):
        return self.repo.get_all(db, skip, limit)

    def get_by_id(self, db: Session, supplier_id: int):
        supplier = self.repo.get_by_id(db, supplier_id)
        if not supplier:
            raise HTTPException(status_code=404, detail="Proveedor no encontrado")
        return supplier

    def create(self, db: Session, data: SupplierCreate):
        supplier = Supplier(**data.model_dump())
        return self.repo.create(db, supplier)

    def update(self, db: Session, supplier_id: int, data: SupplierUpdate):
        supplier = self.get_by_id(db, supplier_id)
        for field, value in data.model_dump(exclude_unset=True).items():
            setattr(supplier, field, value)
        return self.repo.update(db, supplier)


class ProductService:

    def __init__(self):
        self.repo = ProductRepository()

    def get_all(self, db: Session, skip: int = 0, limit: int = 100):
        return self.repo.get_all(db, skip, limit)

    def get_by_id(self, db: Session, product_id: int):
        product = self.repo.get_by_id(db, product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        return product

    def get_by_code(self, db: Session, code: str):
        """HU-02: buscar por código de barras"""
        product = self.repo.get_by_code(db, code)
        if not product:
            raise HTTPException(status_code=404, detail="Producto no encontrado con ese código")
        return product

    def search(self, db: Session, query: str):
        """HU-06: búsqueda en tiempo real"""
        return self.repo.search(db, query)

    def create(self, db: Session, data: ProductCreate):
        """HU-05: crear producto"""
        existing = self.repo.get_by_code(db, data.code)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Ya existe un producto con ese código"
            )
        product = Product(**data.model_dump())
        return self.repo.create(db, product)

    def update(self, db: Session, product_id: int, data: ProductUpdate):
        """HU-05: editar producto"""
        product = self.get_by_id(db, product_id)
        for field, value in data.model_dump(exclude_unset=True).items():
            setattr(product, field, value)
        return self.repo.update(db, product)

    def delete(self, db: Session, product_id: int):
        """HU-05: eliminación lógica"""
        product = self.get_by_id(db, product_id)
        product.is_active = False
        return self.repo.update(db, product)

    def get_alerts(self, db: Session, expiry_days: int = 30):
        """HU-07: alertas de stock bajo y vencimiento"""
        return {
            "low_stock": self.repo.get_low_stock(db),
            "expiring_soon": self.repo.get_expiring_soon(db, expiry_days)
        }


