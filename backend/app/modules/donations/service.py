from sqlalchemy.orm import Session
from fastapi import HTTPException
from typing import Optional

from app.modules.donations.repository import DonationRepository, ProductMovementRepository
from app.modules.donations.model import Donation, DonationItem, ProductMovement
from app.modules.donations.schema import DonationCreate
from app.modules.inventory.repository import ProductRepository


class DonationService:

    def __init__(self):
        self.repo = DonationRepository()
        self.movement_repo = ProductMovementRepository()
        self.product_repo = ProductRepository()

    def list_donations(self, db: Session, skip: int = 0, limit: int = 100, donation_type: Optional[str] = None):
        return self.repo.get_all(db, skip, limit, donation_type)

    def get_donation(self, db: Session, donation_id: int):
        donation = self.repo.get_by_id(db, donation_id)
        if not donation or not donation.is_active:
            raise HTTPException(status_code=404, detail="Donación no encontrada")
        return donation

    def create_donation(self, db: Session, data: DonationCreate):
        # Validar productos y stock
        validated_items = []
        for item_data in data.items:
            product = self.product_repo.get_by_id(db, item_data.product_id)
            if not product or not product.is_active:
                raise HTTPException(
                    status_code=404,
                    detail=f"Producto con id {item_data.product_id} no encontrado"
                )
            if data.donation_type == "delivered" and product.stock < item_data.quantity:
                raise HTTPException(
                    status_code=400,
                    detail=f"Stock insuficiente para '{product.name}'. Disponible: {product.stock}"
                )
            validated_items.append((product, item_data.quantity))

        try:
            donation = Donation(
                donation_type=data.donation_type,
                donor_or_recipient=data.donor_or_recipient,
                donation_date=data.donation_date,
                notes=data.notes
            )
            db.add(donation)
            db.flush()

            for product, quantity in validated_items:
                item = DonationItem(
                    donation_id=donation.id,
                    product_id=product.id,
                    quantity=quantity
                )
                db.add(item)

                if data.donation_type == "received":
                    product.stock += quantity
                    movement_type = "donation_in"
                else:
                    product.stock -= quantity
                    movement_type = "donation_out"

                movement = ProductMovement(
                    product_id=product.id,
                    movement_type=movement_type,
                    quantity=quantity if data.donation_type == "received" else -quantity,
                    reference_id=donation.id,
                    reference_type="donation"
                )
                db.add(movement)

            db.commit()
            db.refresh(donation)
            return donation

        except HTTPException:
            db.rollback()
            raise
        except Exception:
            db.rollback()
            raise HTTPException(
                status_code=400,
                detail="No se pudo registrar la donación"
            )

    def delete_donation(self, db: Session, donation_id: int):
        donation = self.get_donation(db, donation_id)
        return self.repo.deactivate(db, donation)

    def get_product_movements(self, db: Session, product_id: int):
        product = self.product_repo.get_by_id(db, product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        return self.movement_repo.get_by_product(db, product_id)
