from datetime import date

from sqlalchemy.orm import Session

from app.modules.expenses.schema import ExpenseCreate, ExpenseUpdate
from app.modules.expenses.service import ExpenseService


class ExpenseController:
    @staticmethod
    def list_expenses(
        db: Session,
        skip: int = 0,
        limit: int = 100,
        date_from: date | None = None,
        date_to: date | None = None,
        category: str | None = None,
    ):
        return ExpenseService.list_expenses(
            db,
            skip,
            limit,
            date_from,
            date_to,
            category,
        )

    @staticmethod
    def get_expense(db: Session, expense_id: int):
        return ExpenseService.get_expense(db, expense_id)

    @staticmethod
    def create_expense(db: Session, data: ExpenseCreate):
        return ExpenseService.create_expense(db, data)

    @staticmethod
    def update_expense(db: Session, expense_id: int, data: ExpenseUpdate):
        return ExpenseService.update_expense(db, expense_id, data)

    @staticmethod
    def delete_expense(db: Session, expense_id: int):
        return ExpenseService.delete_expense(db, expense_id)
