from typing import Optional
from sqlalchemy.orm import Session

from app.db.models import User


def get_user_by_id(db: Session, user_id: int):
    return (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )


def update_user(
    db: Session,
    user: User,
    name: Optional[str] = None,
    password: Optional[str] = None
):
    if name is not None:
        user.name = name
    if password is not None:
        user.password = password

    db.commit()
    db.refresh(user)

    return user


def delete_user(db: Session, user: User):
    db.delete(user)
    db.commit()

    return True