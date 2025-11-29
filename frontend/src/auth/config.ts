import { HOST } from '@env'; // np. 10.0.2.2 dla emulatora Androida

export const oidc = {
  issuer: `http://${HOST}:8180/realms/veer`, // Twój realm z Keycloaka
  clientId: 'veer-mobile',
  clientSecret: '', // zostaw pusty
  redirectUrl: 'veer://callback',
  scopes: ['openid', 'profile', 'email', 'offline_access'],
  dangerouslyAllowInsecureHttpRequests: true, 
  clockSkew: 60,
};