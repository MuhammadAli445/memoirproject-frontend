from fastapi import FastAPI

from app.db.database import Base, engine
from app.domain import model
from app.domain.auth import router


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Authentication API"
)


app.include_router(router)


@app.get("/")
def root():
    return {
        "message": "Authentication API is running"
    }