from sqlalchemy.orm import Session
from datetime import date
from typing import Optional
from app.modules.expenses.model import Expense


class ExpenseRepository:

    def get_all(
        self,
        db: Session,
        skip: int = 0,
        limit: int = 100,
        date_from: Optional[date] = None,
        date_to: Optional[date] = None,
        category: Optional[str] = None
    ):
        query = db.query(Expense).filter(Expense.is_active == True)

        if date_from:
            query = query.filter(Expense.expense_date >= date_from)
        if date_to:
            query = query.filter(Expense.expense_date <= date_to)
        if category:
            query = query.filter(Expense.category == category)

        return query.order_by(Expense.expense_date.desc()).offset(skip).limit(limit).all()

    def get_by_id(self, db: Session, expense_id: int):
        return db.query(Expense).filter(
            Expense.id == expense_id,
            Expense.is_active == True
        ).first()

    def create(self, db: Session, expense: Expense):
        db.add(expense)
        db.commit()
        db.refresh(expense)
        return expense

    def update(self, db: Session, expense: Expense):
        db.commit()
        db.refresh(expense)
        return expense

    def deactivate(self, db: Session, expense: Expense):
        expense.is_active = False
        db.commit()
        db.refresh(expense)
        return expense
