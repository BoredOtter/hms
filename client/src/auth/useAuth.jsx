import { useEffect, useState, useRef } from 'react';
import keycloak from './keycloak';

const useAuth = () => {
    const isRun = useRef(false);
    const [isLogin, setLogin] = useState(false);
    const [roles, setRoles] = useState('')
    
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
            });
    }, []);

    return [isLogin, roles];
};

export default useAuth;
