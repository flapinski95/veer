const axios = require('axios');
const qs = require('qs');

const KEYCLOAK_BASE_URL = process.env.KEYCLOAK_URL || 'http://keycloak:8080';
const REALM = process.env.KEYCLOAK_REALM || 'veer';
const ADMIN_CLIENT_ID = 'admin-cli';

const ADMIN_USERNAME = process.env.KEYCLOAK_ADMIN_USER || 'admin';
const ADMIN_PASSWORD = process.env.KEYCLOAK_ADMIN_PASS || 'secret';

const PUBLIC_CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID || 'app';

async function getAdminAccessToken() {
  try {
    const response = await axios.post(
      `${KEYCLOAK_BASE_URL}/realms/master/protocol/openid-connect/token`,
      qs.stringify({
        grant_type: 'password',
        client_id: ADMIN_CLIENT_ID,
        username: ADMIN_USERNAME,
        password: ADMIN_PASSWORD,
      }),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );

    return response.data.access_token;
  } catch (err) {
    console.error('[Keycloak] Błąd pobierania tokenu admina:', err.response?.data || err.message);
    throw new Error('Nie udało się pobrać tokenu admina');
  }
}

module.exports = {getAdminAccessToken}