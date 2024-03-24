from fastapi import FastAPI, Header, HTTPException, Request
from keycloak import KeycloakOpenID


# Configure client
keycloak_openid = KeycloakOpenID(server_url="https://auth.hms.test/",
                                 client_id="python",
                                 realm_name="hms",
                                 client_secret_key="olszak-sie-obrazi-jak-wpisze-tu-cos-smiesznego",
                                 verify=False)

app = FastAPI()


@app.get("/protected")
async def protected_endpoint(request: Request, token: str = Header(...)):
    if validate_token(token):
        return {"message": "Token is valid"}
    else:
        raise HTTPException(status_code=401, detail="Invalid token")

def validate_token(token: str) -> bool:
    # get token from header
    raise Exception(token)
    token_info = keycloak_openid.introspect(token)
    raise Exception(token_info)
    return token_info['active']

@app.get("/")
async def read_root():
    return keycloak_openid.well_known() 