const axios = require('axios');

const KEYCLOAK_BASE_URL = process.env.KEYCLOAK_BASE_URL;
const REALM = process.env.KEYCLOAK_REALM;
const CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID;

async function loginUser({ username, password }) {
  try {
    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('client_id', CLIENT_ID);
    params.append('username', username);
    params.append('password', password);

    const response = await axios.post(
      `${KEYCLOAK_BASE_URL}/realms/${REALM}/protocol/openid-connect/token`,
      params.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return response.data; 
  } catch (err) {
    console.error('[Keycloak] Błąd logowania:', err.response?.data || err.message);
    throw new Error('Nieprawidłowy login lub hasło');
  }
}

module.exports = {
  loginUser,
};