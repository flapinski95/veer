require("dotenv").config();

const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.User;
const router = express.Router();

router.post("/google", async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ message: "Missing ID token" });
  }

  try {
    const { data } = await axios.get(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`
    );

    const { email, given_name, family_name, sub, email_verified } = data;

    if (!email_verified) {
      return res.status(400).json({ message: "Email not verified by google" });
    }

    let user = await User.findOne({ where: { email } });

    if (!user) {
      user = await User.create({
        email: email,
        username: email.split("@")[0],
        name: given_name,
        surname: family_name || "",
        googleId: sub,
        isverified: true,
        country: null,
      });
    }

    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login via Google successful",
      user,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(401).json({ message: "Google token invalid or expired" });
  }
});

module.exports = router;
