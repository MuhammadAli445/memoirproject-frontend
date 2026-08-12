from fastapi import HTTPException,APIRouter,Depends
from sqlalchemy.orm import Session
from app.domain.model import User
from app.domain.schemas import userloginSchema,UsersignupSchema,UserResponseSchema
from app.utils.security import hash_password,verify_password
from app.db.dependencies import get_db


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post("/signup", response_model=UserResponseSchema)
def signup(data: UsersignupSchema, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(User.email == data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    user = User(
        full_name=data.full_name,
        email=data.email,
        password_hash=hash_password(data.password)
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user
