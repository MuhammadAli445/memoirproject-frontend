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

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime
from uuid import UUID


class ProjectCreate(BaseModel):
    subject_name: Optional[str] = None
    relationship_to_subject: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None


class ProjectUpdate(BaseModel):
    subject_name: Optional[str] = None
    relationship_to_subject: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    onboarding_step: Optional[int] = None
    onboarding_data: Optional[Dict[str, Any]] = None


class ProjectCoverUpdate(BaseModel):
    cover_photo_url: str


class ProjectOut(BaseModel):
    id: UUID
    owner_id: UUID
    subject_name: Optional[str]
    relationship_to_subject: Optional[str]
    start_date: Optional[datetime]
    end_date: Optional[datetime]
    cover_photo_url: Optional[str]
    onboarding_step: int
    onboarding_data: Optional[Dict[str, Any]]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True  # pydantic v2 (orm_mode ka naya naam)