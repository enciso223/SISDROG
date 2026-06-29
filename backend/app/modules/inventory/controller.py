from sqlalchemy.orm import Session

from app.modules.inventory.schema import ProductCreate
from app.modules.inventory.service import ProductService


class ProductController:
    @staticmethod
    def list_products(db: Session, skip: int = 0, limit: int = 100):
        return ProductService.list_products(db, skip, limit)

    @staticmethod
    def get_product(db: Session, product_id: int):
        return ProductService.get_product(db, product_id)

    @staticmethod
    def create_product(db: Session, data: ProductCreate):
        return ProductService.create_product(db, data)
