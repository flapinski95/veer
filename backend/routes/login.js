require("dotenv").config();
const express = require("express");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.User;

const {
  validateEmail,
  validatePassword,
} = require("../middleware/validateInput");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      return res.status(400).json({ message: "Missing login or password" });
    }

    let user;
    if (login.includes("@")) {
      if (!validateEmail(login)) {
        return res.status(400).json({ message: "Invalid email format" });
      }
      user = await User.findOne({ where: { email: login } });
    } else {
      user = await User.findOne({ where: { username: login } });
    }

    if (!user) {
      return res.status(400).json({ message: "Invalid login or password" });
    }

    if (!validatePassword(password)) {
      return res
        .status(400)
        .json({ message: "Password must be 6–100 characters and safe." });
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isverified) {
      return res.status(403).json({
        message:
          "Account not verified. Please check your email for the verification code.",
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
      message: "Logged in successfully",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        surname: user.surname,
        country: user.country,
        isverified: user.isverified,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;
