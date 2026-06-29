from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.modules.donations.model import Donation, DonationItem, ProductMovement
from app.modules.donations.repository import (
    DonationRepository,
    ProductMovementRepository,
)
from app.modules.donations.schema import DonationCreate
from app.modules.inventory.repository import ProductRepository


class DonationService:
    @staticmethod
    def list_donations(
        db: Session,
        skip: int = 0,
        limit: int = 100,
        donation_type: str | None = None,
    ):
        if donation_type and donation_type not in {"received", "delivered"}:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='donation_type debe ser "received" o "delivered"',
            )
        return DonationRepository.get_all(db, skip, limit, donation_type)

    @staticmethod
    def get_donation(db: Session, donation_id: int):
        donation = DonationRepository.get_by_id(db, donation_id)
        if donation is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Donación no encontrada",
            )
        return donation

    @staticmethod
    def create_donation(db: Session, data: DonationCreate):
        if not data.items:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="La donación debe tener al menos un ítem",
            )

        try:
            donation = Donation(
                donation_type=data.donation_type,
                donor_or_recipient=data.donor_or_recipient,
                donation_date=data.donation_date,
                notes=data.notes,
            )
            DonationRepository.create_donation(db, donation)

            for item_data in data.items:
                product = ProductRepository.get_by_id(db, item_data.product_id)
                if product is None:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail=f"Producto {item_data.product_id} no encontrado",
                    )

                if data.donation_type == "delivered" and product.quantity < item_data.quantity:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=(
                            "Stock insuficiente para el producto "
                            f"{product.id}: disponible {product.quantity}, "
                            f"solicitado {item_data.quantity}"
                        ),
                    )

                DonationRepository.create_item(
                    db,
                    DonationItem(
                        donation_id=donation.id,
                        product_id=item_data.product_id,
                        quantity=item_data.quantity,
                    ),
                )

                if data.donation_type == "received":
                    product.quantity += item_data.quantity
                    movement_type = "donation_in"
                    movement_quantity = item_data.quantity
                else:
                    product.quantity -= item_data.quantity
                    movement_type = "donation_out"
                    movement_quantity = -item_data.quantity

                ProductMovementRepository.create(
                    db,
                    ProductMovement(
                        product_id=product.id,
                        movement_type=movement_type,
                        quantity=movement_quantity,
                        reference_id=donation.id,
                        reference_type="donation",
                        notes=data.notes,
                    ),
                )
                db.add(product)
            db.commit()
            db.refresh(donation)
            return DonationService.get_donation(db, donation.id)
        except HTTPException:
            db.rollback()
            raise
        except Exception as exc:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No se pudo registrar la donación",
            ) from exc

    @staticmethod
    def delete_donation(db: Session, donation_id: int):
        if not DonationRepository.deactivate(db, donation_id):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Donación no encontrada",
            )
        return {"message": "Donación eliminada correctamente"}

    @staticmethod
    def list_product_movements(db: Session, product_id: int):
        product = ProductRepository.get_by_id(db, product_id)
        if product is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Producto no encontrado",
            )
        return ProductMovementRepository.get_by_product_id(db, product_id)
