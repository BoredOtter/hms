import axios from 'axios';
import keycloak from '../auth/keycloak';

const httpResources = axios.create({
  baseURL: 'https://hms.test/api/v1/resources',
  timeout: 5000,
  headers: {
    'Accept': 'application/json',
  }
});

httpResources.interceptors.request.use(
  async (config) => {
    if (keycloak.isTokenExpired()) {
      try {
        await keycloak.updateToken();
      } catch (refreshError) {
        keycloak.logout();
        return Promise.reject(refreshError);
      }
    }
    
    config.headers.token = `Bearer ${keycloak.token}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default httpResources;
