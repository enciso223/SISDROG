from datetime import date

from sqlalchemy.orm import Session

from app.modules.expenses.model import Expense


class ExpenseRepository:
    @staticmethod
    def get_all(
        db: Session,
        skip: int = 0,
        limit: int = 100,
        date_from: date | None = None,
        date_to: date | None = None,
        category: str | None = None,
    ) -> list[Expense]:
        query = db.query(Expense).filter(Expense.is_active.is_(True))
        if date_from:
            query = query.filter(Expense.expense_date >= date_from)
        if date_to:
            query = query.filter(Expense.expense_date <= date_to)
        if category:
            query = query.filter(Expense.category == category)
        return (
            query.order_by(Expense.expense_date.desc(), Expense.id.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    @staticmethod
    def get_by_id(db: Session, expense_id: int) -> Expense | None:
        return (
            db.query(Expense)
            .filter(Expense.id == expense_id, Expense.is_active.is_(True))
            .first()
        )

    @staticmethod
    def create(db: Session, expense: Expense) -> Expense:
        db.add(expense)
        db.commit()
        db.refresh(expense)
        return expense

    @staticmethod
    def update(db: Session, expense: Expense) -> Expense:
        db.add(expense)
        db.commit()
        db.refresh(expense)
        return expense

    @staticmethod
    def deactivate(db: Session, expense_id: int) -> bool:
        expense = ExpenseRepository.get_by_id(db, expense_id)
        if expense is None:
            return False
        expense.is_active = False
        db.add(expense)
        db.commit()
        return True
