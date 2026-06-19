from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm

from app.database.database import get_db
from app.modules.auth.service import AuthService
from app.modules.auth.schema import (
    UserCreate,
    UserResponse,
    Token,
    LoginRequest
)
from app.core.security import get_current_user
from app.modules.auth.controller import AuthController
from fastapi.security import OAuth2PasswordBearer


router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)

controller = AuthController()
auth_service = AuthService() 
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login-form")

# ✅ REGISTER
@router.post("/register", response_model=UserResponse)
def register(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    return controller.register(db, user_data)


# ✅ LOGIN (JSON)
@router.post("/login", response_model=Token)

def login(
    request: LoginRequest,
    db: Session = Depends(get_db)
):
    return auth_service.login_user(
        db,
        request.email,
        request.password
    )


# ✅ LOGIN FORM
@router.post("/login-form", response_model=Token)
def login_form(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    return auth_service.login_user(
        db,
        form_data.username,
        form_data.password
    )


# ✅ LOGOUT
@router.post("/logout")
def logout(current_user=Depends(get_current_user)):
    return {"message": "Sesión cerrada correctamente"}


# ✅ CURRENT USER
@router.get("/me")
def me(
    token: str = Depends(oauth2_scheme),
    current_user=Depends(get_current_user)
):
    return current_user