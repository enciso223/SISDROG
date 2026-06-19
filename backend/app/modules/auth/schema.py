from pydantic import BaseModel
from pydantic import EmailStr 
from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):

    name: str
    email: EmailStr
    password: str

class UserResponse(BaseModel):

    id: int
    name: str
    email: EmailStr
    is_active: bool

    class Config:
        from_attributes = True
         
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    email: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


