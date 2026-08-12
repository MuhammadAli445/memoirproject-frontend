from pydantic import BaseModel, EmailStr

class UsersignupSchema(BaseModel):
    full_name: str
    email: EmailStr
    password: str

class userloginSchema(BaseModel):
    email: EmailStr
    password: str

class UserResponseSchema(BaseModel):
    id: int
    full_name: str
    email: EmailStr

    class Config:
        from_attributes = True