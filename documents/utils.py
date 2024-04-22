from os import environ

from fastapi import HTTPException, Request

from keycloak import KeycloakOpenID

KC_URL = environ.get("KC_URL", "http://keycloak")
KC_PORT = environ.get("KC_PORT", "8080")
KC_REALM = environ.get("KC_REALM", "hms")
KC_CLIENT_ID = environ.get("KC_CLIENT_ID", "python")
KC_CLIENT_SECRET = environ.get("KC_CLIENT_SECRET")

# Configure client
keycloak_openid = KeycloakOpenID(
    server_url=f"{KC_URL}:{KC_PORT}",
    client_id=KC_CLIENT_ID,
    realm_name=KC_REALM,
    client_secret_key=KC_CLIENT_SECRET,
    verify=False,
)


def token_validator(func):
    async def wrapper(request: Request):
        token = request.headers.get("authorization", "")

        if not token:
            raise HTTPException(status_code=401, detail="Token is missing")
        else:
            token = token.split(" ")
            if len(token) != 2 or token[0].lower() != "bearer":
                raise HTTPException(status_code=401, detail="Invalid token")
            token = token[1]
            if not validate_token(token):
                raise HTTPException(status_code=401, detail="Unauthorized")
        return await func()

    return wrapper


def validate_token(token: str) -> bool:
    token_info = keycloak_openid.introspect(token)
    return token_info["active"]
