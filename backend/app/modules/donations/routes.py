from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database.database import get_db
from app.core.security import get_current_user
from app.modules.auth.model import User
from app.modules.donations.schema import DonationCreate, DonationResponse, DonationListResponse, ProductMovementResponse
from app.modules.donations.controller import DonationController

router = APIRouter(tags=["Donations"])

ctrl = DonationController()


@router.get("/donations", response_model=List[DonationListResponse])
def list_donations(
    skip: int = 0,
    limit: int = 100,
    donation_type: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return ctrl.list(db, skip, limit, donation_type)


@router.get("/donations/{donation_id}", response_model=DonationResponse)
def get_donation(
    donation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return ctrl.get(db, donation_id)


@router.post("/donations", response_model=DonationResponse, status_code=201)
def create_donation(
    data: DonationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return ctrl.create(db, data)


@router.delete("/donations/{donation_id}", status_code=204)
def delete_donation(
    donation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ctrl.delete(db, donation_id)


@router.get("/products/{product_id}/movements", response_model=List[ProductMovementResponse])
def get_product_movements(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return ctrl.get_movements(db, product_id)
