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


    useEffect(() => {
        if(isRun.current) return;
        isRun.current = true;
        client.init({ onLoad: 'login-required' }).then((authenticated) => setLogin(authenticated));
    }, []);

    return isLogin;
};

export default useAuth;
