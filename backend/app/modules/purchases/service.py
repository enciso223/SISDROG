from decimal import Decimal

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.modules.donations.model import ProductMovement
from app.modules.inventory.repository import ProductRepository
from app.modules.purchases.model import Purchase, PurchaseItem
from app.modules.purchases.repository import PurchaseRepository
from app.modules.purchases.schema import PurchaseCreate
from app.modules.suppliers.repository import SupplierRepository


class PurchaseService:
    @staticmethod
    def list_purchases(db: Session, skip: int = 0, limit: int = 100):
        return PurchaseRepository.get_all(db, skip, limit)

    @staticmethod
    def get_purchase(db: Session, purchase_id: int):
        purchase = PurchaseRepository.get_by_id(db, purchase_id)
        if purchase is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Compra no encontrada",
            )
        return purchase

    @staticmethod
    def create_purchase(db: Session, data: PurchaseCreate):
        if not data.items:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="La compra debe tener al menos un ítem",
            )

        try:
            supplier = SupplierRepository.get_by_id(db, data.supplier_id)
            if supplier is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Proveedor no encontrado",
                )

            purchase = Purchase(
                supplier_id=data.supplier_id,
                purchase_date=data.purchase_date,
                notes=data.notes,
                total_amount=Decimal("0"),
            )
            PurchaseRepository.create_purchase(db, purchase)

            total_amount = Decimal("0")
            for item_data in data.items:
                product = ProductRepository.get_by_id(db, item_data.product_id)
                if product is None:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail=f"Producto {item_data.product_id} no encontrado",
                    )

                subtotal = item_data.unit_price * item_data.quantity
                total_amount += subtotal
                item = PurchaseItem(
                    purchase_id=purchase.id,
                    product_id=item_data.product_id,
                    quantity=item_data.quantity,
                    unit_price=item_data.unit_price,
                    subtotal=subtotal,
                )
                PurchaseRepository.create_item(db, item)
                product.quantity += item_data.quantity

                db.add(
                    ProductMovement(
                        product_id=product.id,
                        movement_type="purchase_in",
                        quantity=item_data.quantity,
                        reference_id=purchase.id,
                        reference_type="purchase",
                        notes="Compra registrada",
                    )
                )

            purchase.total_amount = total_amount
            db.add(purchase)
            db.commit()
            db.refresh(purchase)
            return PurchaseService.get_purchase(db, purchase.id)
        except HTTPException:
            db.rollback()
            raise
        except Exception as exc:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No se pudo registrar la compra",
            ) from exc

    @staticmethod
    def delete_purchase(db: Session, purchase_id: int):
        if not PurchaseRepository.deactivate(db, purchase_id):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Compra no encontrada",
            )
        return {"message": "Compra eliminada correctamente"}
