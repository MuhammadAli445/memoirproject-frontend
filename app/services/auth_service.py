from sqlalchemy.orm import Session

from app.db.models import User
from app.schemas.auth import SignupRequest, LoginRequest


def signup_user(db: Session, user_data: SignupRequest):
    existing_user = (
        db.query(User)
        .filter(User.email == user_data.email)
        .first()
    )

    if existing_user:
        return None

    new_user = User(
        name=user_data.name,
        email=user_data.email,
        password=user_data.password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


def login_user(db: Session, user_data: LoginRequest):
    # Find user by email
    user = (
        db.query(User)
        .filter(User.email == user_data.email)
        .first()
    )

    if not user:
        return None

    # Temporary check.
    # Your teammate's password verification will be integrated here.
    if user.password != user_data.password:
        return None

    return user