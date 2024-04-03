import { useLocation, Navigate, Outlet } from "react-router-dom";
import keycloak from "./keycloak";
const RequireAuth = ({ allowedRoles }) => {
 
    const roles = "";
    const tokenPayload = keycloak.tokenParsed;
    if(tokenPayload && tokenPayload.realm_access && tokenPayload.realm_access.roles){
        roles = tokenPayload.realm_access.roles;
    }
    const location = useLocation();

    return (
        roles.find(role => allowedRoles?.includes(role))
            ? <Outlet />
            : auth?.user
                ? <Navigate to="/unauthorized" state={{ from: location }} replace />
                : <Navigate to="/login" state={{ from: location }} replace />
    );
}

export default RequireAuth;