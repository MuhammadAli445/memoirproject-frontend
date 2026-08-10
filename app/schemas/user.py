from typing import Optional
from pydantic import BaseModel
from pydantic import EmailStr

class UserResponse(BaseModel):
    name: str
    email: EmailStr


class UpdateUserRequest(BaseModel):
    name: Optional[str] = None
    password: Optional[str] = None