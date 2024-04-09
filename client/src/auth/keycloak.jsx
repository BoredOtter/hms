import Keycloak from "keycloak-js";
const keycloak = new Keycloak({
    //i hate JS, HTML, REACT, VITE, and all of this
    //react/vite/js cant directly read system envs 
    //TODO: build no-dev image without VITE etc and use envs from system
    url: "https://auth.hms.test.boredotter.dev",
    realm: "hms",
    clientId: "hms",
});

export default keycloak;