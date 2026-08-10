from pydantic import BaseModel


class UserResponse(BaseModel):
    name: str
    email: EmailStr


class UpdateUserRequest(BaseModel):
    name: str
    password: str