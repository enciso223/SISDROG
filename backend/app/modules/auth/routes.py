from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.database.database import get_db

from app.modules.auth.schema import (
    UserCreate,
    UserResponse
)

from app.modules.auth.controller import AuthController

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)

controller = AuthController()

@router.post(
    "/register",
    response_model=UserResponse
)
def register(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):

    return controller.register(
        db,
        user_data
    )