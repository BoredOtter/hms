from fastapi import FastAPI, Header, HTTPException
from keycloak import KeycloakOpenID

# Configure client
keycloak_openid = KeycloakOpenID(server_url="https://auth.hms.test/",
                                 client_id="python",
                                 realm_name="hms",
                                 client_secret_key="hGWk6fNTxLdezfFbVzKPK0kFn5NKZ0kf",
                                 verify=False)

app = FastAPI()

@app.get("/protected")
async def protected_endpoint(token: str = Header(...)):
    if validate_token(token):
        return {"message": "Token is valid"}
    else:
        raise HTTPException(status_code=401, detail="Invalid token")

def validate_token(token: str) -> bool:
    # get token from header
    token_info = keycloak_openid.introspect(token)
    return token_info['active']

@app.get("/")
async def read_root():
    return keycloak_openid.well_known() 