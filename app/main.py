from fastapi import FastAPI
from starlette.middleware.sessions import SessionMiddleware

from app.api.routes.auth import router as auth_router
from app.core.config import get_settings
from app.db.database import Base, engine
from app.models.user import User  # noqa: F401 — registers model with SQLAlchemy metadata

settings = get_settings()

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Memory App API"
)

# SessionMiddleware is required by Google OAuth to store the 'state' CSRF token
app.add_middleware(SessionMiddleware, secret_key=settings.JWT_SECRET_KEY)

app.include_router(auth_router)


@app.get("/")
def root():
    return {
        "message": "API is running"
    }
