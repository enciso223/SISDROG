

from sqlalchemy.orm import Session

from app.modules.inventory.model import Product


class ProductRepository:
    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> list[Product]:
        return (
            db.query(Product)
            .filter(Product.is_active.is_(True))
            .offset(skip)
            .limit(limit)
            .all()
        )

    @staticmethod
    def get_by_id(db: Session, product_id: int) -> Product | None:
        return (
            db.query(Product)
            .filter(Product.id == product_id, Product.is_active.is_(True))
            .first()
        )

    @staticmethod
    def create(db: Session, product: Product) -> Product:
        db.add(product)
        db.commit()
        db.refresh(product)
        return product
