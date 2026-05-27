from sqlalchemy.orm import Session

from app.modules.auth.schema import UserCreate
from app.modules.auth.service import AuthService

class AuthController:

    def __init__(self):

        self.service = AuthService()

    def register(
        self,
        db: Session,
        user_data: UserCreate
    ):

        return self.service.register_user(
            db,
            user_data
        )
