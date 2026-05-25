from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class MedicineBase(BaseModel):
	name: str
	description: Optional[str] = None
	price: float
	quantity: int


class MedicineCreate(MedicineBase):
	pass


class MedicineUpdate(BaseModel):
	name: Optional[str] = None
	description: Optional[str] = None
	price: Optional[float] = None
	quantity: Optional[int] = None


class MedicineOut(MedicineBase):
	id: int
	created_at: Optional[datetime]

	class Config:
		orm_mode = True


