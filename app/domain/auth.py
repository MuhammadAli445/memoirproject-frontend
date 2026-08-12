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


@router.post("/login")
def login(
    data: userloginSchema,
    db: Session = Depends(get_db)
):
    
    user = db.query(User).filter(User.email == data.email).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )
    
    password_correct = verify_password(
        data.password,
        user.password_hash
    )

    if not password_correct:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )
    

    # 5. Login successful
    return {
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer"
    }