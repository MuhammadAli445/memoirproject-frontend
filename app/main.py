from fastapi import FastAPI

from app.db.database import Base, engine
from app.db import models
from app.routers.auth import router as auth_router
from app.routers.user import router as user_router


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Memory App API"
)


app.include_router(auth_router)
app.include_router(user_router)


@app.get("/")
def root():
    return {
        "message": "API is running"
    }