from sqlalchemy.orm import Session

from app.modules.auth.schema import LoginRequest, Token, UserCreate
from app.modules.auth.service import AuthService


class AuthController:
    @staticmethod
    def register_user(db: Session, data: UserCreate):
        return AuthService.register_user(db, data)

    @staticmethod
    def login_user(db: Session, data: LoginRequest) -> Token:
        return AuthService.login_user(db, data)
