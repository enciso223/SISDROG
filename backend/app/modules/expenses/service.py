from datetime import date

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.modules.expenses.model import Expense
from app.modules.expenses.repository import ExpenseRepository
from app.modules.expenses.schema import ExpenseCreate, ExpenseUpdate


class ExpenseService:
    @staticmethod
    def list_expenses(
        db: Session,
        skip: int = 0,
        limit: int = 100,
        date_from: date | None = None,
        date_to: date | None = None,
        category: str | None = None,
    ):
        if date_from and date_to and date_from > date_to:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El rango de fechas no es válido",
            )
        return ExpenseRepository.get_all(db, skip, limit, date_from, date_to, category)

    @staticmethod
    def get_expense(db: Session, expense_id: int):
        expense = ExpenseRepository.get_by_id(db, expense_id)
        if expense is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Gasto no encontrado",
            )
        return expense

    @staticmethod
    def create_expense(db: Session, data: ExpenseCreate):
        return ExpenseRepository.create(db, Expense(**data.model_dump()))

    @staticmethod
    def update_expense(db: Session, expense_id: int, data: ExpenseUpdate):
        expense = ExpenseService.get_expense(db, expense_id)
        for field, value in data.model_dump(exclude_unset=True).items():
            setattr(expense, field, value)
        return ExpenseRepository.update(db, expense)

    @staticmethod
    def delete_expense(db: Session, expense_id: int):
        if not ExpenseRepository.deactivate(db, expense_id):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Gasto no encontrado",
            )
        return {"message": "Gasto eliminado correctamente"}
