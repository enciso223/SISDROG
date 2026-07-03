from sqlalchemy.orm import Session
from datetime import date
from typing import Optional

from app.modules.expenses.service import ExpenseService
from app.modules.expenses.schema import ExpenseCreate, ExpenseUpdate


class ExpenseController:

    def __init__(self):
        self.service = ExpenseService()

    def list(self, db, skip, limit, date_from, date_to, category):
        return self.service.list_expenses(db, skip, limit, date_from, date_to, category)

    def get(self, db, expense_id):
        return self.service.get_expense(db, expense_id)

    def create(self, db, data: ExpenseCreate):
        return self.service.create_expense(db, data)

    def update(self, db, expense_id, data: ExpenseUpdate):
        return self.service.update_expense(db, expense_id, data)

    def delete(self, db, expense_id):
        return self.service.delete_expense(db, expense_id)
