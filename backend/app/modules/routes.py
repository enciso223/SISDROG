from typing import List

from fastapi import APIRouter, status

from app.modules import controller
from app.modules.schema import MedicineCreate, MedicineUpdate, MedicineOut


router = APIRouter(prefix="/medicines", tags=["medicines"])


@router.get("/", response_model=List[MedicineOut])
def list_medicines(skip: int = 0, limit: int = 100):
	return controller.list_medicines(skip=skip, limit=limit)


@router.get("/{medicine_id}", response_model=MedicineOut)
def get_medicine(medicine_id: int):
	return controller.get_medicine(medicine_id)


@router.post("/", response_model=MedicineOut, status_code=status.HTTP_201_CREATED)
def create_medicine(data: MedicineCreate):
	return controller.create_medicine(data)


@router.put("/{medicine_id}", response_model=MedicineOut)
def update_medicine(medicine_id: int, data: MedicineUpdate):
	return controller.update_medicine(medicine_id, data)


@router.delete("/{medicine_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_medicine(medicine_id: int):
	controller.delete_medicine(medicine_id)
	return None


