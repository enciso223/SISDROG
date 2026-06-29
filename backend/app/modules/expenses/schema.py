from datetime import date, datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator


class ExpenseCreate(BaseModel):
    amount: Decimal = Field(gt=0)
    reason: str = Field(min_length=1, max_length=300)
    expense_date: date
    category: Optional[str] = None
    notes: Optional[str] = None

    @field_validator("reason")
    @classmethod
    def validate_reason(cls, value: str):
        if not value.strip():
            raise ValueError("El motivo no puede estar vacío")
        return value.strip()


class ExpenseUpdate(BaseModel):
    amount: Optional[Decimal] = Field(default=None, gt=0)
    reason: Optional[str] = Field(default=None, min_length=1, max_length=300)
    expense_date: Optional[date] = None
    category: Optional[str] = None
    notes: Optional[str] = None

    @field_validator("reason")
    @classmethod
    def validate_reason(cls, value: Optional[str]):
        if value is not None and not value.strip():
            raise ValueError("El motivo no puede estar vacío")
        return value.strip() if value is not None else value


class ExpenseResponse(BaseModel):
    id: int
    amount: Decimal
    reason: str
    expense_date: date
    category: Optional[str]
    notes: Optional[str]
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ExpenseFilterParams(BaseModel):
    date_from: Optional[date] = None
    date_to: Optional[date] = None
    category: Optional[str] = None
