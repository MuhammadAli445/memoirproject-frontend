from pydantic import BaseModel
from email_validator import EmailStr


class UserResponse(BaseModel):
    name: str
    email: EmailStr


class UpdateUserRequest(BaseModel):
    name: str
    password: str