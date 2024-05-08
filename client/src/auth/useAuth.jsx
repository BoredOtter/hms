import { useEffect, useState } from 'react';
import keycloak from './keycloak';

const useAuth = () => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [isLogin, setLogin] = useState(false);
    const [roles, setRoles] = useState('');
    const [uuid, setUuid] = useState('');
    const [name , setName] = useState('');
    useEffect(() => {
        if (!isInitialized) {
            keycloak
                .init({ onLoad: 'login-required' })
                .then((authenticated) => {
                    setLogin(authenticated);
                    console.log(keycloak.token);
                    const tokenPayload = keycloak.tokenParsed;
                    if (tokenPayload && tokenPayload.realm_access && tokenPayload.realm_access.roles) {
                        setRoles(tokenPayload.realm_access.roles);
                    }
                    setUuid(tokenPayload.sub);
                    setName(tokenPayload.name);
                })
                .catch((error) => {
                    console.error('Error initializing Keycloak:', error);
                })
                .finally(() => {
                    setIsInitialized(true);
                });
        }
    }, []);

    return [isLogin, roles, uuid, name];
};

export default useAuth;
