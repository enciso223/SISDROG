from sqlalchemy.orm import Session

from app.modules.auth.repository import AuthRepository
from app.modules.auth.model import User
from app.modules.auth.schema import UserCreate

from app.core.security import hash_password, verify_password, create_access_token

from fastapi import HTTPException


class AuthService:

    def __init__(self):
        self.repository = AuthRepository()

    def register_user(self, db: Session, user_data: UserCreate):

        existing_user = self.repository.get_user_by_email(
            db,
            user_data.email
        )

        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="Email already exists"
            )

        hashed_pw = hash_password(user_data.password)

        new_user = User(
            name=user_data.name,
            email=user_data.email,
            hashed_password=hashed_pw
        )

        return self.repository.create_user(db, new_user)

    def login_user(self, db: Session, email: str, password: str):

        user = self.repository.get_user_by_email(db, email)

        if not user:
            raise HTTPException(
                status_code=401,
                detail="Credenciales incorrectas"
            )

        if not verify_password(password, user.hashed_password):
            raise HTTPException(
                status_code=401,
                detail="Credenciales incorrectas"
            )

        if not user.is_active:
            raise HTTPException(
                status_code=403,
                detail="Usuario inactivo"
            )

        token = create_access_token({
            "sub": str(user.id)
        })

        return {
            "access_token": token,
            "token_type": "bearer"
        }