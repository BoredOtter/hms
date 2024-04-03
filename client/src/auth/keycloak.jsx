import Keycloak from "keycloak-js";
const keycloak = new Keycloak({
    url: "https://auth.hms.test",
    realm: "hms",
    clientId: "hms",
});

export default keycloak;