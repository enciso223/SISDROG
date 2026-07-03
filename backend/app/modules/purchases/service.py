from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.modules.purchases.repository import PurchaseRepository
from app.modules.purchases.model import Purchase, PurchaseItem
from app.modules.purchases.schema import PurchaseCreate
from app.modules.inventory.repository import SupplierRepository, ProductRepository


class PurchaseService:

    def __init__(self):
        self.repo = PurchaseRepository()
        self.supplier_repo = SupplierRepository()
        self.product_repo = ProductRepository()

    def list_purchases(self, db: Session, skip: int = 0, limit: int = 100):
        return self.repo.get_all(db, skip, limit)

    def get_purchase(self, db: Session, purchase_id: int):
        purchase = self.repo.get_by_id(db, purchase_id)
        if not purchase or not purchase.is_active:
            raise HTTPException(status_code=404, detail="Compra no encontrada")
        return purchase

    def create_purchase(self, db: Session, data: PurchaseCreate):
        supplier = self.supplier_repo.get_by_id(db, data.supplier_id)
        if not supplier or not supplier.is_active:
            raise HTTPException(status_code=404, detail="Proveedor no encontrado")

        validated_items = []
        total_amount = 0.0

        for item_data in data.items:
            product = self.product_repo.get_by_id(db, item_data.product_id)
            if not product or not product.is_active:
                raise HTTPException(
                    status_code=404,
                    detail=f"Producto con id {item_data.product_id} no encontrado"
                )
            subtotal = round(item_data.quantity * item_data.unit_price, 2)
            total_amount += subtotal
            validated_items.append((product, item_data.quantity, item_data.unit_price, subtotal))

        try:
            purchase = Purchase(
                supplier_id=data.supplier_id,
                purchase_date=data.purchase_date,
                total_amount=round(total_amount, 2),
                notes=data.notes
            )
            db.add(purchase)
            db.flush()

            for product, quantity, unit_price, subtotal in validated_items:
                item = PurchaseItem(
                    purchase_id=purchase.id,
                    product_id=product.id,
                    quantity=quantity,
                    unit_price=unit_price,
                    subtotal=subtotal
                )
                db.add(item)
                product.stock += quantity

            db.commit()
            db.refresh(purchase)
            return purchase

        except Exception:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No se pudo registrar la compra"
            )

    def delete_purchase(self, db: Session, purchase_id: int):
        purchase = self.get_purchase(db, purchase_id)
        return self.repo.deactivate(db, purchase)
