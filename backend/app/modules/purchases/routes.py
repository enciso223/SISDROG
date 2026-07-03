from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database.database import get_db
from app.core.security import get_current_user
from app.modules.auth.model import User
from app.modules.purchases.schema import PurchaseCreate, PurchaseResponse, PurchaseListResponse
from app.modules.purchases.controller import PurchaseController

router = APIRouter(prefix="/purchases", tags=["Purchases"])

ctrl = PurchaseController()


@router.get("", response_model=List[PurchaseListResponse])
def list_purchases(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return ctrl.list(db, skip, limit)


@router.get("/{purchase_id}", response_model=PurchaseResponse)
def get_purchase(
    purchase_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return ctrl.get(db, purchase_id)


@router.post("", response_model=PurchaseResponse, status_code=201)
def create_purchase(
    data: PurchaseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return ctrl.create(db, data)


@router.delete("/{purchase_id}", status_code=204)
def delete_purchase(
    purchase_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ctrl.delete(db, purchase_id)
