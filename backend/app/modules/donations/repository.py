from sqlalchemy.orm import Session, selectinload

from app.modules.donations.model import Donation, DonationItem, ProductMovement


class DonationRepository:
    @staticmethod
    def get_all(
        db: Session,
        skip: int = 0,
        limit: int = 100,
        donation_type: str | None = None,
    ) -> list[Donation]:
        query = (
            db.query(Donation)
            .options(selectinload(Donation.items))
            .filter(Donation.is_active.is_(True))
        )
        if donation_type:
            query = query.filter(Donation.donation_type == donation_type)
        return (
            query.order_by(Donation.donation_date.desc(), Donation.id.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    @staticmethod
    def get_by_id(db: Session, donation_id: int) -> Donation | None:
        return (
            db.query(Donation)
            .options(selectinload(Donation.items))
            .filter(Donation.id == donation_id, Donation.is_active.is_(True))
            .first()
        )

    @staticmethod
    def create_donation(db: Session, donation: Donation) -> Donation:
        db.add(donation)
        db.flush()
        return donation

    @staticmethod
    def create_item(db: Session, item: DonationItem) -> DonationItem:
        db.add(item)
        db.flush()
        return item

    @staticmethod
    def deactivate(db: Session, donation_id: int) -> bool:
        donation = DonationRepository.get_by_id(db, donation_id)
        if donation is None:
            return False
        donation.is_active = False
        db.add(donation)
        db.commit()
        return True


class ProductMovementRepository:
    @staticmethod
    def create(db: Session, movement: ProductMovement) -> ProductMovement:
        db.add(movement)
        db.flush()
        return movement

    @staticmethod
    def get_by_product_id(db: Session, product_id: int) -> list[ProductMovement]:
        return (
            db.query(ProductMovement)
            .filter(ProductMovement.product_id == product_id)
            .order_by(ProductMovement.movement_date.desc(), ProductMovement.id.desc())
            .all()
        )
