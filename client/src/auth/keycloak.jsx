import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
    url: process.env.KEYCLOAK_SERVER_URL,
    realm: process.env.REALM_NAME,
    clientId: process.env.CLIENT_ID,
});

export default keycloak;