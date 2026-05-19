from fastapi import Request, Response
from src.server.core._settings import settings
from src.server.core.constants import ACCESS_COOKIE_NAME, REFRESH_COOKIE_NAME


def get_client_ip(request: Request) -> str | None:
    x_forwarded_for = request.headers.get("x-forwarded-for")
    if x_forwarded_for:
        return x_forwarded_for.split(",")[0].strip()

    if request.client:
        return request.client.host

    return None


def set_auth_cookies(response: Response, access_token: str, refresh_token: str) -> None:
    is_secure_cookie = settings.environment.lower() == "production"

    response.set_cookie(
        key=ACCESS_COOKIE_NAME,
        value=access_token,
        httponly=True,
        secure=is_secure_cookie,
        samesite="lax",
        max_age=settings.access_token_expire_minutes * 60,
    )
    response.set_cookie(
        key=REFRESH_COOKIE_NAME,
        value=refresh_token,
        httponly=True,
        secure=is_secure_cookie,
        samesite="lax",
        max_age=settings.refresh_token_expire_day * 24 * 60 * 60,
    )
