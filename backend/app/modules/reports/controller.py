from sqlalchemy.orm import Session
from datetime import date
from typing import Optional

from app.modules.reports.service import ReportsService


class ReportsController:

    def __init__(self):
        self.service = ReportsService()

    def get_purchase_history(self, db, skip, limit, date_from, date_to, supplier_id):
        return self.service.get_purchase_history(db, skip, limit, date_from, date_to, supplier_id)

    def get_financial_balance(self, db, date_from, date_to):
        return self.service.get_financial_balance(db, date_from, date_to)

    def get_sales_report(self, db, date_from, date_to):
        return self.service.get_sales_report(db, date_from, date_to)

    def get_top_products(self, db, limit, date_from, date_to):
        return self.service.get_top_products(db, limit, date_from, date_to)

    def get_inventory_value(self, db):
        return self.service.get_inventory_value(db)
