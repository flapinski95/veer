require("dotenv").config();
const express = require("express");
const router = express.Router();
const db = require("../models");
const User = db.User;
const sendForgotPasswordEmail = require("../utils/sendMail").sendForgotPasswordEmail;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const {
  validateEmail,
  validatePassword,
  containsMalicious,
} = require("../middleware/validateInput");

router.post("/", async (req, res) => {
    const {email} = req.body;

    if (!email) {
        return res.status(400).json({ message: "required fields missing" });
    }

    if (!validateEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
    }

    const user = await User.findOne({ where: { email: email} });

    if (!user) {
      return res.status(400).json({ message: "Invalid login or password" });
    }

    const verificationToken = jwt.sign({ userId: user.id },process.env.JWT_SECRET,{ expiresIn: "1d" });
    await user.update({ verificationToken });

    const link = `${process.env.CLIENT_URL}/api/forgot-password/change-password/${verificationToken}`;
    await sendForgotPasswordEmail(user.email, link);
})

router.post("/change-password/:token", async (req, res) => {
    const { token } = req.params;

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { password } = req.body;
    const user = await User.findOne({ where: { id: decoded.userId } });

    if (!user || user.verificationToken !== token|| !password) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    if (!validatePassword(password)) {
      return res
        .status(400)
        .json({ message: "Password must be 6–100 characters and safe." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await user.update({
      password: hashedPassword,
      verificationToken: null
    });

    res.json({message: "Password changed", user: {id: user.id} })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

})

module.exports = router;
