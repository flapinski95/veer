require("dotenv").config();
const axios = require("axios");
const qs = require("qs");


const registerUser = require("../services/register")
exports.register = async (req, res) => {
    const {username, email, password, country ,firstName, lastName, } = req.body
    try {
        registerUser({username, email, password, country ,firstName, lastName, })
        return res.status(201).json("Registered")
    } catch(err) {
        return res.status(400).json({error: err.message})
    }
}

const loginUser = require("../services/login")
exports.login = async (req, res) => {
    const {username, password} = req.body;
    try {
        const tokenResponse = loginUser({username, password})
        return res.status(200).json(tokenResponse);
    } catch (err) {
        return res.status(401).json({ error: err.message });
    }
}

const KEYCLOAK_TOKEN_URL = `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`;

exports.loginWithGoogle = async (req, res) => {
  const { id_token } = req.body;

  if (!id_token) {
    return res.status(400).json({ error: 'Missing id_token' });
  }

  try {
    const response = await axios.post(
      KEYCLOAK_TOKEN_URL,
      qs.stringify({
        grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
        subject_token: id_token,
        subject_token_type: 'urn:ietf:params:oauth:token-type:id_token',
        requested_token_type: 'urn:ietf:params:oauth:token-type:access_token',
        client_id: process.env.KEYCLOAK_CLIENT_ID,
      }),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );

    const token = response.data.access_token;
    const refreshToken = response.data.refresh_token;

    return res.json({ token, refreshToken });
  } catch (err) {
    console.error('[Google Native Login] Error:', err.response?.data || err.message);
    return res.status(500).json({ error: 'Login with Google failed' });
  }
}

