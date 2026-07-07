from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database.database import get_db
from app.core.security import get_current_user
from app.modules.auth.model import User
from app.modules.purchases.schema import PurchaseCreate, PurchaseResponse
from app.modules.purchases.service import PurchaseService

router = APIRouter(prefix="/purchases", tags=["Purchases"])

svc = PurchaseService()


@router.get("", response_model=List[PurchaseResponse])
def list_purchases(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return svc.list_purchases(db, skip, limit)


@router.get("/{purchase_id}", response_model=PurchaseResponse)
def get_purchase(
    purchase_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return svc.get_purchase(db, purchase_id)


@router.post("", response_model=PurchaseResponse, status_code=201)
def create_purchase(
    data: PurchaseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Registrar compra — crea lote automáticamente con fecha de vencimiento"""
    return svc.create_purchase(db, data)


@router.delete("/{purchase_id}", status_code=204)
def delete_purchase(
    purchase_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    svc.delete_purchase(db, purchase_id)
