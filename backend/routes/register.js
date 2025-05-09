require("dotenv").config();

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const router = express.Router();
const db = require("../models");
const User = db.User;

const {
  validateEmail,
  validatePassword,
  containsMalicious,
} = require("../middleware/validateInput");

router.post("/", async (req, res) => {
  try {
    const { username, name, surname, email, password } = req.body;

    if (!username || !name || !surname || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (
      containsMalicious(username) ||
      containsMalicious(name) ||
      containsMalicious(surname) ||
      containsMalicious(email) ||
      containsMalicious(password)
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
    });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    //TODO:
    // await sendVerificationEmail(user.email, code);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        email: user.email,
        favoriteDirectors: user.favoriteDirectors,
        favoriteActors: user.favoriteActors,
        favoriteGenres: user.favoriteGenres,
        isVerified: user.isVerified,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
