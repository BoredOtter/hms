import requests

def get_keycloak_token(username, password, client_id, client_secret, realm, token_url):
    payload = {
        'grant_type': 'password',
        'client_id': client_id,
        'username': username,
        'client_secret': client_secret,
        'password': password
    }

    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    response = requests.post(token_url, data=payload, headers=headers, verify=False)

    if response.status_code == 200:
        return response.json()
    else:
        return None

# Example usage
username = 'admin'
password = 'admin'
client_id = 'hms'
client_secret = 'Bh61dgLYqcZ4ijWxEKMzAayXWNifr6N8'
realm = 'hms'
token_url = 'https://auth.hms.test/auth/realms/hms/protocol/openid-connect/token'.format(realm=realm)

token_data = get_keycloak_token(username, password, client_id, client_secret, realm, token_url)
if token_data:
    access_token = token_data['access_token']
    print("Access token:", access_token)
else:
    print("Failed to obtain Keycloak token.")
