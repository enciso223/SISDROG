from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import date, datetime
from decimal import Decimal


class ExpenseCreate(BaseModel):
    amount: float
    reason: str
    expense_date: date
    category: Optional[str] = None
    notes: Optional[str] = None

    @field_validator("amount")
    @classmethod
    def amount_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError("El monto debe ser mayor a 0")
        return v

    @field_validator("reason")
    @classmethod
    def reason_not_empty(cls, v):
        if not v.strip():
            raise ValueError("El motivo no puede estar vacío")
        return v


class ExpenseUpdate(BaseModel):
    amount: Optional[float] = None
    reason: Optional[str] = None
    expense_date: Optional[date] = None
    category: Optional[str] = None
    notes: Optional[str] = None


class ExpenseResponse(BaseModel):
    id: int
    amount: float
    reason: str
    expense_date: date
    category: Optional[str] = None
    notes: Optional[str] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
