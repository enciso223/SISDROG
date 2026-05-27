from sqlalchemy.orm import Session

from app.modules.auth.repository import AuthRepository
from app.modules.auth.model import User
from app.modules.auth.schema import UserCreate

from app.core.security import hash_password

class AuthService:

    def __init__(self):

        self.repository = AuthRepository()

    def register_user(
        self,
        db: Session,
        user_data: UserCreate
    ):

        existing_user = self.repository.get_user_by_email(
            db,
            user_data.email
        )

        if existing_user:
            raise Exception("Email already exists")

        hashed_pw = hash_password(
            user_data.password
        )

        new_user = User(
            name=user_data.name,
            email=user_data.email,
            hashed_password=hashed_pw
        )

        return self.repository.create_user(
            db,
            new_user
        )


