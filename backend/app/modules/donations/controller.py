from sqlalchemy.orm import Session
from typing import Optional

from app.modules.donations.service import DonationService
from app.modules.donations.schema import DonationCreate


class DonationController:

    def __init__(self):
        self.service = DonationService()

    def list(self, db, skip, limit, donation_type):
        return self.service.list_donations(db, skip, limit, donation_type)

    def get(self, db, donation_id):
        return self.service.get_donation(db, donation_id)

    def create(self, db, data: DonationCreate):
        return self.service.create_donation(db, data)

    def delete(self, db, donation_id):
        return self.service.delete_donation(db, donation_id)

    def get_movements(self, db, product_id):
        return self.service.get_product_movements(db, product_id)
