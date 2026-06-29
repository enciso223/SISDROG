

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.modules.inventory.model import Product
from app.modules.inventory.repository import ProductRepository
from app.modules.inventory.schema import ProductCreate


class ProductService:
    @staticmethod
    def list_products(db: Session, skip: int = 0, limit: int = 100):
        return ProductRepository.get_all(db, skip, limit)

    @staticmethod
    def get_product(db: Session, product_id: int):
        product = ProductRepository.get_by_id(db, product_id)
        if product is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Producto no encontrado",
            )
        return product

    @staticmethod
    def create_product(db: Session, data: ProductCreate):
        return ProductRepository.create(db, Product(**data.model_dump()))
