require("dotenv").config();

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendVerificationEmail = async (email, link) => {
  try {
    const mailOptions = {
      from: `"Veer" <6r1m6969@gmail.com>`,
      replyTo: "6r1m6969@gmail.com",
      to: email,
      subject: "Account verification",
      text: `Verify your account: ${link}`,
      html: `<p>Verify your account: <strong>${link}</strong></p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email wysłany do ${email}: ${info.response}`);
  } catch (error) {
    console.error("Błąd wysyłania e-maila:", error);
  }
};

module.exports = sendVerificationEmail;
