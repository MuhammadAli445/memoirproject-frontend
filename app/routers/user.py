from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.schemas.user import UserResponse, UpdateUserRequest
from app.services.user_service import (
    get_user_by_id,
    update_user,
    delete_user
)


router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.get("/me", response_model=UserResponse)
def get_me(
    db: Session = Depends(get_db)
):
    # Temporary user ID for testing.
    # Later this will come from the authenticated user/JWT.
    user_id = 1

    user = get_user_by_id(db, user_id)

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user


@router.put("/me", response_model=UserResponse)
def update_me(
    user_data: UpdateUserRequest,
    db: Session = Depends(get_db)
):
    # Temporary user ID for testing.
    user_id = 1

    user = get_user_by_id(db, user_id)

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    updated_user = update_user(
        db,
        user,
        user_data.name,
        user_data.password
    )

    return updated_user


@router.delete("/me")
def delete_me(
    db: Session = Depends(get_db)
):
    # Temporary user ID for testing.
    user_id = 1

    user = get_user_by_id(db, user_id)

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    delete_user(db, user)

    return {
        "message": "User deleted successfully"
    }