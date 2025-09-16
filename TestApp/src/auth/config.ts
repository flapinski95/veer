// src/auth/config.ts
export const oidc = {
  issuer: 'http://<HOST>:8088/auth/realms/veer', // Nginx -> Keycloak
  clientId: 'veer-mobile',
  redirectUrl: 'veer://callback',
  scopes: ['openid', 'profile', 'email', 'offline_access'], // offline_access -> refresh token
  dangerouslyAllowInsecureHttpRequests: true, // DEV over http
};