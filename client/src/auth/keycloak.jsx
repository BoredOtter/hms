import Keycloak from "keycloak-js";
import { useState } from "react";

const keycloak = new Keycloak({
    url: "https://auth.hms.test",
    realm: "hms",
    clientId: "hms",
});

export default keycloak;