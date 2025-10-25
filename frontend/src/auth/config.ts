// src/auth/config.ts
import { HOST } from '@env';

export const oidc = {
  issuer: `http://192.168.0.113:8180/realms/veer`,
  clientId: 'veer-mobile',
  redirectUrl: 'veer://callback',
  scopes: ['openid', 'profile', 'email', 'offline_access'],
  dangerouslyAllowInsecureHttpRequests: true, // dev over http
  // (opcjonalnie, ale bezpieczne)
  additionalParameters: {}, // upewnia, że nie poleci NSNull
};
