from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.database.database import get_db
from app.modules.auth.model import User
from app.modules.donations.controller import DonationController
from app.modules.donations.schema import (
    DonationCreate,
    DonationResponse,
    ProductMovementResponse,
)


router = APIRouter(tags=["Donations"])


@router.get("/donations", response_model=list[DonationResponse])
def list_donations(
    skip: int = 0,
    limit: int = 100,
    donation_type: str | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return DonationController.list_donations(db, skip, limit, donation_type)


@router.get("/donations/{donation_id}", response_model=DonationResponse)
def get_donation(
    donation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return DonationController.get_donation(db, donation_id)


@router.post(
    "/donations",
    response_model=DonationResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_donation(
    data: DonationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return DonationController.create_donation(db, data)


@router.delete("/donations/{donation_id}")
def delete_donation(
    donation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return DonationController.delete_donation(db, donation_id)


@router.get(
    "/products/{product_id}/movements",
    response_model=list[ProductMovementResponse],
    tags=["Product Movements"],
)
def list_product_movements(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return DonationController.list_product_movements(db, product_id)
