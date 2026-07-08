from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from datetime import date

from app.modules.inventory.repository import ProductRepository, CategoryRepository, ProductLotRepository
from app.modules.inventory.model import Product, Category, ProductLot
from app.modules.inventory.schema import ProductCreate, ProductUpdate, CategoryCreate, ProductLotCreate


class CategoryService:

    def __init__(self):
        self.repo = CategoryRepository()

    def get_all(self, db: Session):
        return self.repo.get_all(db)

    def create(self, db: Session, data: CategoryCreate):
        existing = self.repo.get_by_name(db, data.name)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Ya existe una categoría con el nombre '{data.name}'"
            )
        category = Category(**data.model_dump())
        return self.repo.create(db, category)


class ProductLotService:

    def __init__(self):
        self.repo = ProductLotRepository()
        self.product_repo = ProductRepository()

    def get_lots_by_product(self, db: Session, product_id: int):
        product = self.product_repo.get_by_id(db, product_id)
        if not product or not product.is_active:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        return self.repo.get_by_product(db, product_id)

    def add_lot(self, db: Session, product_id: int, data: ProductLotCreate):
        product = self.product_repo.get_by_id(db, product_id)
        if not product or not product.is_active:
            raise HTTPException(status_code=404, detail="Producto no encontrado")

        if data.expiry_date <= date.today():
            raise HTTPException(
                status_code=400,
                detail="La fecha de vencimiento debe ser futura"
            )

        lot = ProductLot(
            product_id=product_id,
            **data.model_dump()
        )
        self.repo.create(db, lot)
        product.stock += data.stock
        db.commit()
        db.refresh(lot)
        return lot

    def get_expiring_soon(self, db: Session, days: int = 30):
        lots = self.repo.get_expiring_soon(db, days)
        result = []
        for lot in lots:
            days_until = (lot.expiry_date - date.today()).days
            result.append({
                "lot_id": lot.id,
                "product_id": lot.product_id,
                "product_name": lot.product.name,
                "lot_number": lot.lot_number,
                "expiry_date": lot.expiry_date,
                "days_until_expiry": days_until,
                "stock": lot.stock
            })
        return result


class ProductService:

    def __init__(self):
        self.repo = ProductRepository()
        self.lot_repo = ProductLotRepository()
        self.category_repo = CategoryRepository()

    def get_all(self, db: Session, skip: int = 0, limit: int = 100):
        return self.repo.get_all(db, skip, limit)

    def get_by_id(self, db: Session, product_id: int):
        product = self.repo.get_by_id(db, product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        return product

    def get_by_code(self, db: Session, code: str):
        product = self.repo.get_by_code(db, code)
        if not product:
            raise HTTPException(status_code=404, detail="Producto no encontrado con ese código")
        return product

    def search(self, db: Session, query: str):
        return self.repo.search(db, query)

    def create(self, db: Session, data: ProductCreate):
        existing = self.repo.get_by_code(db, data.code)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Ya existe un producto con el código '{data.code}'"
            )

        lots_data = data.lots
        product_data = data.model_dump(exclude={"lots"})
        product = Product(**product_data)

        if lots_data:
            total_lot_stock = sum(l.stock for l in lots_data)
            product.stock = total_lot_stock
        
        db.add(product)
        db.flush()

        if lots_data:
            for lot_data in lots_data:
                if lot_data.expiry_date <= date.today():
                    db.rollback()
                    raise HTTPException(
                        status_code=400,
                        detail=f"El lote '{lot_data.lot_number}' tiene fecha de vencimiento pasada o de hoy"
                    )
                lot = ProductLot(product_id=product.id, **lot_data.model_dump())
                db.add(lot)

        db.commit()
        db.refresh(product)
        return product

    def update(self, db: Session, product_id: int, data: ProductUpdate):
        product = self.get_by_id(db, product_id)
        
        update_data = data.model_dump(exclude_unset=True)
        lots_data = update_data.pop("lots", None)
        
        for field, value in update_data.items():
            setattr(product, field, value)
            
        if lots_data is not None:
            # Eliminar lotes existentes para reemplazarlos
            for existing_lot in product.lots:
                db.delete(existing_lot)
            db.flush()
            
            total_stock = 0
            for lot_data in lots_data:
                lot = ProductLot(product_id=product.id, **lot_data)
                db.add(lot)
                total_stock += lot.stock
                
            product.stock = total_stock

        return self.repo.update(db, product)

    def delete(self, db: Session, product_id: int):
        product = self.get_by_id(db, product_id)
        product.is_active = False
        return self.repo.update(db, product)

    def get_alerts(self, db: Session, expiry_days: int = 30):
        lot_service = ProductLotService()
        return {
            "low_stock": self.repo.get_low_stock(db),
            "expiring_soon": lot_service.get_expiring_soon(db, expiry_days)
        }
