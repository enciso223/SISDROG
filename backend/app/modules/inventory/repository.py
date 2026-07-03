from sqlalchemy.orm import Session
from sqlalchemy import or_
from datetime import date, timedelta
from app.modules.inventory.model import Product, Category, Supplier


class CategoryRepository:

    def get_all(self, db: Session):
        return db.query(Category).all()

    def get_by_id(self, db: Session, category_id: int):
        return db.query(Category).filter(Category.id == category_id).first()

    def get_by_name(self, db: Session, name: str):
        return db.query(Category).filter(Category.name == name).first()

    def create(self, db: Session, category: Category):
        db.add(category)
        db.commit()
        db.refresh(category)
        return category


class SupplierRepository:

    def get_all(self, db: Session, skip: int = 0, limit: int = 100):
        return db.query(Supplier).filter(Supplier.is_active == True).offset(skip).limit(limit).all()

    def get_by_id(self, db: Session, supplier_id: int):
        return db.query(Supplier).filter(Supplier.id == supplier_id).first()

    def create(self, db: Session, supplier: Supplier):
        db.add(supplier)
        db.commit()
        db.refresh(supplier)
        return supplier

    def update(self, db: Session, supplier: Supplier):
        db.commit()
        db.refresh(supplier)
        return supplier


class ProductRepository:

    def get_all(self, db: Session, skip: int = 0, limit: int = 100):
        return db.query(Product).filter(Product.is_active == True).offset(skip).limit(limit).all()

    def get_by_id(self, db: Session, product_id: int):
        return db.query(Product).filter(Product.id == product_id).first()

    def get_by_code(self, db: Session, code: str):
        return db.query(Product).filter(Product.code == code).first()

    def search(self, db: Session, query: str):
        """HU-06: buscar por nombre o código"""
        return db.query(Product).filter(
            or_(
                Product.name.ilike(f"%{query}%"),
                Product.code.ilike(f"%{query}%")
            )
        ).all()

    def create(self, db: Session, product: Product):
        db.add(product)
        db.commit()
        db.refresh(product)
        return product

    def update(self, db: Session, product: Product):
        db.commit()
        db.refresh(product)
        return product

    def get_low_stock(self, db: Session):
        """HU-07: productos con stock menor al mínimo"""
        return db.query(Product).filter(
            Product.is_active == True,
            Product.stock <= Product.min_stock
        ).all()

    def get_expiring_soon(self, db: Session, days: int = 30):
        """HU-07: productos próximos a vencer"""
        cutoff = date.today() + timedelta(days=days)
        return db.query(Product).filter(
            Product.is_active == True,
            Product.expiry_date != None,
            Product.expiry_date <= cutoff
        ).all()

    def adjust_stock(self, db: Session, product: Product, quantity_delta: int):
        """HU-08: actualización automática de stock"""
        product.stock += quantity_delta
        db.commit()
        db.refresh(product)
        return product
