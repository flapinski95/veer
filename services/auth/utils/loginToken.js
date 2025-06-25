async function loginUser(username, password) {
  try {
    const response = await axios.post(
      `${KEYCLOAK_BASE_URL}/realms/${REALM}/protocol/openid-connect/token`,
      qs.stringify({
        grant_type: 'password',
        client_id: PUBLIC_CLIENT_ID,
        username,
        password,
      }),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );

    return response.data; 
  } catch (err) {
    console.error('[Keycloak] Błąd logowania użytkownika:', err.response?.data || err.message);
    throw new Error('Nie udało się zalogować użytkownika');
  }
}

module.exports = {
  loginUser,
};