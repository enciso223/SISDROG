from fastapi import APIRouter, Depends, Request, status
from pydantic import ValidationError
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.database.database import get_db
from app.modules.auth.controller import AuthController
from app.modules.auth.model import User
from app.modules.auth.schema import LoginRequest, Token, UserCreate, UserResponse


router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(data: UserCreate, db: Session = Depends(get_db)):
    return AuthController.register_user(db, data)


@router.post("/login", response_model=Token)
async def login_user(request: Request, db: Session = Depends(get_db)):
    content_type = request.headers.get("content-type", "")
    if "application/json" in content_type:
        data = LoginRequest.model_validate(await request.json())
    else:
        form = await request.form()
        raw_data = {
            "email": form.get("email") or form.get("username"),
            "password": form.get("password"),
        }
        try:
            data = LoginRequest.model_validate(raw_data)
        except ValidationError as exc:
            raise exc
    return AuthController.login_user(db, data)


@router.post("/logout")
def logout_user(current_user: User = Depends(get_current_user)):
    return {"message": "Sesión cerrada correctamente"}


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
