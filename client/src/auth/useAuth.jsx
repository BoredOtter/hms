import { useEffect, useState, useRef } from 'react';
import keycloak from './keycloak';
import httpClient from '../client/HttpClient.jsx';

const useAuth = () => {
    const isRun = useRef(false);
    const [isLogin, setLogin] = useState(false); // Move useState inside the custom hook
    const [roles, setRoles] = useState('');
    useEffect(() => {
        if(isRun.current) return;
        isRun.current = true;
        keycloak
            .init({ onLoad: 'login-required' })
            .then((authenticated) => {
                setLogin(authenticated)
                const tokenPayload = keycloak.tokenParsed;
                if(tokenPayload && tokenPayload.realm_access && tokenPayload.realm_access.roles){
                    setRoles(tokenPayload.realm_access.roles);
                }
                httpClient.defaults.headers.common['Authorization'] = `Bearer ${keycloak.token}`;
            });
    }, []);

    return [isLogin, roles];
};

export default useAuth;
