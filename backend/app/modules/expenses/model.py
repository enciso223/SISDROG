from sqlalchemy import Boolean, Column, Date, DateTime, Integer, Numeric, String, Text, func

from app.database.database import Base


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Numeric(12, 2), nullable=False)
    reason = Column(String(300), nullable=False)
    expense_date = Column(Date, nullable=False, index=True)
    category = Column(String(100), nullable=True, index=True)
    notes = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
