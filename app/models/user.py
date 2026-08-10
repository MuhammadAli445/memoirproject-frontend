from sqlalchemy import Column, Integer, String, Boolean
from app.db.database import Base, SessionLocal


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=True)
    is_oauth_user = Column(Boolean, default=False, nullable=False)


class UserRepository:
    def get_by_id(self, user_id: int) -> User | None:
        with SessionLocal() as db:
            return db.query(User).filter(User.id == user_id).first()

    def get_by_email(self, email: str) -> User | None:
        with SessionLocal() as db:
            return db.query(User).filter(User.email == email).first()

    def create(
        self,
        email: str,
        hashed_password: str | None = None,
        is_oauth_user: bool = False,
        name: str | None = None
    ) -> User:
        with SessionLocal() as db:
            user = User(
                email=email,
                hashed_password=hashed_password,
                is_oauth_user=is_oauth_user,
                name=name
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            # Ensure the object's attributes remain available after session closes
            db.expunge(user)
            return user


user_repository = UserRepository()
