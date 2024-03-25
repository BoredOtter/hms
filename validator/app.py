from fastapi import FastAPI, Header, HTTPException, Request
from keycloak import KeycloakOpenID
from os import environ
import logging

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


logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
app = FastAPI()


@app.get("/api/v1")
async def protected_endpoint(request: Request):

    body = await request.body()
    headers = request.headers
    path_params = request.path_params
    query_params = request.query_params
    request_info = f"Body: {body}\nHeaders: {headers}\nPath params: {path_params}\nQuery params: {query_params}"
    logger.debug(request_info)

    token = request.headers["authorization"].split(" ")[1]

    if not validate_token(token):
        raise HTTPException(status_code=401, detail="Invalid token")
    return {"message": "This is the protected endpoint."}


def validate_token(token: str) -> bool:
    # get token from header
    token_info = keycloak_openid.introspect(token)
    return token_info["active"]


@app.get("/")
async def read_root():
    return keycloak_openid.well_known()
