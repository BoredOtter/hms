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
async def protected_endpoint(request: Request):
    # body = await request.body()
    # headers = request.headers
    # path_params = request.path_params
    # query_params = request.query_params
    # request_info = f"Body: {body}\nHeaders: {headers}\nPath params: {path_params}\nQuery params: {query_params}"
    # print(request_info)
    # raise Exception(request_info)
    token = request.headers['authorization'].split(' ')[1]
    if not validate_token(token):
        raise HTTPException(status_code=401, detail="Invalid token")
    return {"message": "This is the protected endpoint."}


def validate_token(token: str) -> bool:
    # get token from header
    token_info = keycloak_openid.introspect(token)
    return token_info['active']

@app.get("/")
async def read_root():
    return keycloak_openid.well_known() 