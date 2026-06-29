

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import create_access_token, hash_password, verify_password
from app.modules.auth.model import User
from app.modules.auth.repository import UserRepository
from app.modules.auth.schema import LoginRequest, Token, UserCreate


class AuthService:
    @staticmethod
    def register_user(db: Session, data: UserCreate) -> User:
        if UserRepository.get_by_email(db, str(data.email)):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="El usuario ya existe",
            )
        user = User(
            email=str(data.email),
            full_name=data.full_name,
            hashed_password=hash_password(data.password),
        )
        return UserRepository.create(db, user)

    @staticmethod
    def login_user(db: Session, data: LoginRequest) -> Token:
        user = UserRepository.get_by_email(db, str(data.email))
        credentials_error = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas",
            headers={"WWW-Authenticate": "Bearer"},
        )
        if user is None or not verify_password(data.password, user.hashed_password):
            raise credentials_error
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Usuario inactivo",
            )
        access_token = create_access_token({"sub": user.email})
        return Token(access_token=access_token)
