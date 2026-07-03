from sqlalchemy.orm import Session
from fastapi import HTTPException
from datetime import date
from typing import Optional

from app.modules.expenses.repository import ExpenseRepository
from app.modules.expenses.model import Expense
from app.modules.expenses.schema import ExpenseCreate, ExpenseUpdate


class ExpenseService:

    def __init__(self):
        self.repo = ExpenseRepository()

    def list_expenses(
        self,
        db: Session,
        skip: int = 0,
        limit: int = 100,
        date_from: Optional[date] = None,
        date_to: Optional[date] = None,
        category: Optional[str] = None
    ):
        if date_from and date_to and date_from > date_to:
            raise HTTPException(
                status_code=400,
                detail="El rango de fechas no es válido"
            )
        return self.repo.get_all(db, skip, limit, date_from, date_to, category)

    def get_expense(self, db: Session, expense_id: int):
        expense = self.repo.get_by_id(db, expense_id)
        if not expense:
            raise HTTPException(status_code=404, detail="Gasto no encontrado")
        return expense

    def create_expense(self, db: Session, data: ExpenseCreate):
        expense = Expense(**data.model_dump())
        return self.repo.create(db, expense)

    def update_expense(self, db: Session, expense_id: int, data: ExpenseUpdate):
        expense = self.get_expense(db, expense_id)
        for field, value in data.model_dump(exclude_unset=True).items():
            setattr(expense, field, value)
        return self.repo.update(db, expense)

    def delete_expense(self, db: Session, expense_id: int):
        expense = self.get_expense(db, expense_id)
        return self.repo.deactivate(db, expense)
