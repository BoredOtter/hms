import { useEffect, useState, useRef } from 'react';
import keycloak from './keycloak';
// import httpClient from '../client/httpClient';

const useAuth = () => {
    const isRun = useRef(false);
    const [isLogin, setLogin] = useState(false);
    const [roles, setRoles] = useState('');
    const [name, setName] = useState('');
    
    useEffect(() => {
        if(isRun.current) return;
        isRun.current = true;
        keycloak
            .init({ onLoad: 'login-required' })
            .then((authenticated) => {
                setLogin(authenticated)
                const tokenPayload = keycloak.tokenParsed;
                const firstName = tokenPayload.given_name;
                const lastName = tokenPayload.family_name;

                if (firstName && lastName) {
                    const fullName = `${firstName} ${lastName}`;
                    setName(fullName);
                }

                if(tokenPayload && tokenPayload.realm_access && tokenPayload.realm_access.roles){
                    setRoles(tokenPayload.realm_access.roles);
                }
                // httpClient.defaults.headers.common['Authorization'] = `Bearer ${keycloak.token}`;
            });
    }, []);

    return [isLogin, roles, name];
};

export default useAuth;
