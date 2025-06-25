const express = require("express");
const cors = require("cors");
const verifyToken = require("./middlewares/verifyToken");

const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", verifyToken, userRoutes);

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Gateway running at http://localhost:${PORT}`);
});