from typing import List, Optional

from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.modules.model import Medicine


def get_db() -> Session:
	db = SessionLocal()
	try:
		yield db
	finally:
		db.close()


def list_medicines(skip: int = 0, limit: int = 100) -> List[Medicine]:
	db = SessionLocal()
	try:
		return db.query(Medicine).offset(skip).limit(limit).all()
	finally:
		db.close()


def get_medicine_by_id(medicine_id: int) -> Optional[Medicine]:
	db = SessionLocal()
	try:
		return db.query(Medicine).filter(Medicine.id == medicine_id).first()
	finally:
		db.close()


def create_medicine(medicine: Medicine) -> Medicine:
	db = SessionLocal()
	try:
		db.add(medicine)
		db.commit()
		db.refresh(medicine)
		return medicine
	finally:
		db.close()


def update_medicine(medicine: Medicine) -> Medicine:
	db = SessionLocal()
	try:
		db.merge(medicine)
		db.commit()
		db.refresh(medicine)
		return medicine
	finally:
		db.close()


def delete_medicine(medicine: Medicine) -> None:
	db = SessionLocal()
	try:
		db.delete(medicine)
		db.commit()
	finally:
		db.close()


