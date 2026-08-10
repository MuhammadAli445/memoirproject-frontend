from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import RedirectResponse

from app.core.dependencies import get_current_user
from app.core.google_oauth import (
    GoogleOAuthError,
    build_authorization_url,
    exchange_code_for_tokens,
    generate_state,
    verify_id_token,
)
from app.core.jwt import TokenError, create_access_token, create_refresh_token, refresh_access_token
from app.core.security import hash_password, verify_password
from app.models.user import User, user_repository
from app.schemas.auth import (
    AccessTokenResponse,
    LoginRequest,
    RefreshRequest,
    SignupRequest,
    TokenResponse,
    UserOut,
)

router = APIRouter(prefix="/auth", tags=["auth"])


def _issue_tokens(user: User) -> TokenResponse:
    return TokenResponse(
        access_token=create_access_token(user.id),
        refresh_token=create_refresh_token(user.id),
    )


@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def signup(body: SignupRequest) -> TokenResponse:
    if user_repository.get_by_email(body.email):
        raise HTTPException(status.HTTP_409_CONFLICT, "Email already registered")

    user = user_repository.create(
        email=body.email,
        hashed_password=hash_password(body.password),
    )
    return _issue_tokens(user)


@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest) -> TokenResponse:
    invalid = HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid email or password")

    user = user_repository.get_by_email(body.email)
    if user is None or user.hashed_password is None:
        raise invalid
    if not verify_password(body.password, user.hashed_password):
        raise invalid

    return _issue_tokens(user)


@router.post("/refresh", response_model=AccessTokenResponse)
def refresh(body: RefreshRequest) -> AccessTokenResponse:
    try:
        new_access_token = refresh_access_token(body.refresh_token)
    except TokenError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid or expired refresh token")
    return AccessTokenResponse(access_token=new_access_token)


@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)) -> UserOut:
    return UserOut(id=current_user.id, email=current_user.email, is_oauth_user=current_user.is_oauth_user)


# --- Google OAuth ---

@router.get("/google/login")
def google_login(request: Request) -> RedirectResponse:
    state = generate_state()
    request.session["oauth_state"] = state
    return RedirectResponse(build_authorization_url(state))


@router.get("/google/callback", response_model=TokenResponse)
async def google_callback(request: Request, code: str, state: str) -> TokenResponse:
    expected_state = request.session.pop("oauth_state", None)
    if not expected_state or state != expected_state:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Invalid OAuth state")

    try:
        tokens = await exchange_code_for_tokens(code)
        claims = await verify_id_token(tokens["id_token"])
    except GoogleOAuthError as exc:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, str(exc))

    email = claims["email"]
    user = user_repository.get_by_email(email)
    if user is None:
        user = user_repository.create(email=email, is_oauth_user=True)

    return _issue_tokens(user)
