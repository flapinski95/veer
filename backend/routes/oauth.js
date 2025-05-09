require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const router = express.Router();

router.post("/oauth/google", async (req, res) => {
  const googleUser = await axios.get(
    `https://www.googleapis.com/oauth2/v3/userinfo`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );
});

const { email, name } = googleUser.data();

// const user = await

// const token = jwt.sign({ id: user.id });
