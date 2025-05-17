require("dotenv").config();

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const router = express.Router();
const db = require("../models");
const User = db.User;
const sendVerificationEmail = require("../utils/sendMail");

const {
  validateEmail,
  validatePassword,
  containsMalicious,
} = require("../middleware/validateInput");

module.exports = (io) => {
router.post("/", async (req, res) => {
  try {
    const { username, name, surname, email, password, country } = req.body;

    if (!username || !name || !surname || !email || !password || !country) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (
      containsMalicious(username) ||
      containsMalicious(name) ||
      containsMalicious(surname) ||
      containsMalicious(email) ||
      containsMalicious(password) ||
      containsMalicious(country)
    ) {
      return res.status(400).json({ message: "Contains malicious" });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!validatePassword(password)) {
      return res
        .status(400)
        .json({ message: "Password must be 6–100 characters and safe." });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      name,
      surname,
      email,
      password: hashedPassword,
      country,
    });

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

    const verificationToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    await user.update({ verificationToken });
    //TODO
    const link = `${process.env.CLIENT_URL}/api/register/verify/${verificationToken}`;

    await sendVerificationEmail(user.email, link);

    res.status(201).json({
      message: "User registered successfully",
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

router.get("/verify/:token", async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ where: { id: decoded.userId } });

    if (!user || user.verificationToken !== token) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    await user.update({
      isverified: true,
      verificationToken: null,
    });

    io.to(decoded.userId).emit('verified');

    res.json({ message: "Account successfully verified" });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
});
return router

}