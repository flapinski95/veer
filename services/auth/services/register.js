async function registerUser({ username, email, password, country, firstName, lastName }) {
  const adminToken = await getAdminAccessToken();

  try {
    await axios.post(
      `${KEYCLOAK_BASE_URL}/admin/realms/${REALM}/users`,
      {
        username,
        email,
        firstName,
        lastName,
        enabled: true,
        emailVerified: true,
        attributes: {
          country: [country],
        },
        credentials: [
          {
            type: 'password',
            value: password,
            temporary: false,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return { success: true };
  } catch (err) {
    if (err.response?.status === 409) {
      throw new Error('Użytkownik już istnieje');
    }

    console.error('[Keycloak] Błąd rejestracji:', err.response?.data || err.message);
    throw new Error('Nie udało się zarejestrować użytkownika');
  }
}

module.exports = {registerUser}