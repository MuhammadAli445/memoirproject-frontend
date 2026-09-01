from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.database import Base, engine
from app.domain import model
from app.domain.auth import router
from app.domain.project import router as project_router
from app.services.speech_to_text import router as speech_router


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Authentication API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(router)
app.include_router(project_router)
app.include_router(speech_router)


@app.get("/")
def root():
    return {
        "message": "Authentication API is running"
    }