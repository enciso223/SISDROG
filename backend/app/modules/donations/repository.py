from sqlalchemy.orm import Session, joinedload
from typing import Optional
from app.modules.donations.model import Donation, DonationItem, ProductMovement


class DonationRepository:

    def get_all(self, db: Session, skip: int = 0, limit: int = 100, donation_type: Optional[str] = None):
        query = db.query(Donation).filter(Donation.is_active == True)
        if donation_type:
            query = query.filter(Donation.donation_type == donation_type)
        return query.order_by(Donation.donation_date.desc()).offset(skip).limit(limit).all()

    def get_by_id(self, db: Session, donation_id: int):
        return (
            db.query(Donation)
            .options(joinedload(Donation.items))
            .filter(Donation.id == donation_id)
            .first()
        )

    def create(self, db: Session, donation: Donation):
        db.add(donation)
        return donation

    def deactivate(self, db: Session, donation: Donation):
        donation.is_active = False
        db.commit()
        db.refresh(donation)
        return donation


class ProductMovementRepository:

    def get_by_product(self, db: Session, product_id: int):
        return (
            db.query(ProductMovement)
            .filter(ProductMovement.product_id == product_id)
            .order_by(ProductMovement.movement_date.desc())
            .all()
        )

    def create(self, db: Session, movement: ProductMovement):
        db.add(movement)
        return movement
