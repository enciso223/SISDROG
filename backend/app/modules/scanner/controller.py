from typing import List

from app.modules import service
from app.modules.schema import MedicineCreate, MedicineUpdate


def list_medicines(skip: int = 0, limit: int = 100):
	return service.list_medicines(skip=skip, limit=limit)


def get_medicine(medicine_id: int):
	return service.get_medicine(medicine_id)


def create_medicine(data: MedicineCreate):
	return service.create_medicine(data)


def update_medicine(medicine_id: int, data: MedicineUpdate):
	return service.update_medicine(medicine_id, data)


def delete_medicine(medicine_id: int):
	return service.delete_medicine(medicine_id)


