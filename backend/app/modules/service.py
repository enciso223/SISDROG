from typing import List

from fastapi import HTTPException, status

from app.modules import repository
from app.modules.model import Medicine
from app.modules.schema import MedicineCreate, MedicineUpdate


def list_medicines(skip: int = 0, limit: int = 100) -> List[Medicine]:
	return repository.list_medicines(skip=skip, limit=limit)


def get_medicine(medicine_id: int) -> Medicine:
	medicine = repository.get_medicine_by_id(medicine_id)
	if not medicine:
		raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Medicine not found")
	return medicine


def create_medicine(data: MedicineCreate) -> Medicine:
	medicine = Medicine(
		name=data.name,
		description=data.description,
		price=data.price,
		quantity=data.quantity,
	)
	return repository.create_medicine(medicine)


def update_medicine(medicine_id: int, data: MedicineUpdate) -> Medicine:
	medicine = repository.get_medicine_by_id(medicine_id)
	if not medicine:
		raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Medicine not found")

	if data.name is not None:
		medicine.name = data.name
	if data.description is not None:
		medicine.description = data.description
	if data.price is not None:
		medicine.price = data.price
	if data.quantity is not None:
		medicine.quantity = data.quantity

	return repository.update_medicine(medicine)


def delete_medicine(medicine_id: int) -> None:
	medicine = repository.get_medicine_by_id(medicine_id)
	if not medicine:
		raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Medicine not found")
	repository.delete_medicine(medicine)


