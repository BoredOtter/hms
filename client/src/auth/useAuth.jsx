import { useEffect, useState, useRef } from 'react';
import Keycloak from 'keycloak-js';

const client = new Keycloak({
    // url: process.env.KEYCLOAK_SERVER_URL,
    // realm: process.env.REALM_NAME,
    // clientId: process.env.CLIENT_ID,
    url: "https://auth.hms.test",
    realm: "hms",
    clientId: "hms",
});

const useAuth = () => {
    const isRun = useRef(false);
    const [isLogin, setLogin] = useState(false); // Move useState inside the custom hook
    const [token, setToken] = useState(null);
    const [roles, setRoles] = useState(null)

    useEffect(() => {
        if(isRun.current) return;
        isRun.current = true;
        client
            .init({ onLoad: 'login-required' })
            .then((authenticated) => {
                setLogin(authenticated)
                setToken(client.token)
                const tokenPayload = client.tokenParsed;
                if(tokenPayload && tokenPayload.realm_access && tokenPayload.realm_access.roles){
                    setRoles(tokenPayload.realm_access.roles);
                }
                httpClient.defaults.headers.common['Authorization'] = `Bearer ${client.token}`;
            });
    }, []);

    return [isLogin, token, roles];
};

export default useAuth;
