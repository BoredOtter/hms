import keycloak from "./keycloak";
import { useState } from "react";
import { useEffect } from "react";

const loggedUser = () => {
    const [user, setUser] = useState({
        name: '',
        roles: '',
        uuid: ''
    })

    useEffect(()=> {
        const tokenPayload = keycloak.tokenParsed;
        setUser(prevUser => ({ ...prevUser, name: tokenPayload.name }));
        setUser(prevUser => ({...prevUser, uuid: tokenPayload.sub}))
        if (tokenPayload && tokenPayload.realm_access && tokenPayload.realm_access.roles) {
            setUser(prevUser => ({ ...prevUser, roles: tokenPayload.realm_access.roles }));
        }
    }, [])
  return user;
}

export default loggedUser



