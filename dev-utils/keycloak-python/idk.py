from flask import Flask, redirect, url_for, session, request
from keycloak import KeycloakOpenID
from keycloak.exceptions import KeycloakAuthenticationError

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'

# Keycloak configuration
keycloak_openid = KeycloakOpenID(server_url="https://auth.hms.test/",
                                 client_id="hms",
                                 realm_name="hms",
                                 client_secret_key="your_client_secret",
                                 verify=False)  # Disable SSL verification

@app.route('/')
def index():
    if 'userinfo' in session:
        return f'Hello, {session["userinfo"]["preferred_username"]}! <a href="/logout">Logout</a>'
    else:
        return 'Hello, anonymous! <a href="/login">Login</a>'

@app.route('/login')
def login():
    # Redirect to Keycloak login page
    redirect_uri = url_for('callback', _external=True)
    return redirect(keycloak_openid.auth_url(redirect_uri))

@app.route('/callback')
def callback():
    # Parse the callback URL
    code = request.args.get('code')
    redirect_uri = url_for('callback', _external=True)
    
    try:
        token = keycloak_openid.token(code, redirect_uri=redirect_uri)

        # Get user info
        userinfo = keycloak_openid.userinfo(token['access_token'])

        # Store user info in session
        session['userinfo'] = userinfo

        return redirect(url_for('.index'))
    
    except KeycloakAuthenticationError:
        # Clear session data
        session.clear()
        return 'Invalid credentials. Please try again. <a href="/login">Login</a>'

@app.route('/logout')
def logout():
    # Clear session data
    session.clear()
    return redirect(url_for('.index'))

if __name__ == '__main__':
    app.run(debug=True)
