from sqlalchemy.orm import Session

from app.modules.donations.schema import DonationCreate
from app.modules.donations.service import DonationService


class DonationController:
    @staticmethod
    def list_donations(
        db: Session,
        skip: int = 0,
        limit: int = 100,
        donation_type: str | None = None,
    ):
        return DonationService.list_donations(db, skip, limit, donation_type)

    @staticmethod
    def get_donation(db: Session, donation_id: int):
        return DonationService.get_donation(db, donation_id)

    @staticmethod
    def create_donation(db: Session, data: DonationCreate):
        return DonationService.create_donation(db, data)

    @staticmethod
    def delete_donation(db: Session, donation_id: int):
        return DonationService.delete_donation(db, donation_id)

    @staticmethod
    def list_product_movements(db: Session, product_id: int):
        return DonationService.list_product_movements(db, product_id)
