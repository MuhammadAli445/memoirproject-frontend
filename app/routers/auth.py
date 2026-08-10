from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.schemas.auth import SignupRequest, LoginRequest
from app.schemas.user import UserResponse
from app.services.auth_service import signup_user, login_user


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post("/signup", response_model=UserResponse)
def signup(
    user_data: SignupRequest,
    db: Session = Depends(get_db)
):

    user = signup_user(db, user_data)

    if user is None:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    return user


@router.post("/login")
def login(
    user_data: LoginRequest,
    db: Session = Depends(get_db)
):

    user = login_user(db, user_data)

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    return {
        "message": "Login successful",
        "email": user.email
    }