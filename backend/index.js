const express = require("express");
const db = require("./models");

const app = express();
const loginRoutes = require("../backend/routes/login");
const oauthRoutes = require("../backend/routes/oauth");
const registerRoutes = require("../backend/routes/register");
const tokenRoutes = require("../backend/routes/token");

const PORT = 3000;
app.use(express.json());

app.use("/api/register", registerRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/oauth", oauthRoutes);
app.use("/api/token", tokenRoutes);

const start = async () => {
  try {
    await db.sequelize.sync({ alter: true });
    console.log("database connected");
    app.listen(PORT, () => console.log("server running on" + PORT));
  } catch (error) {
    console.error("error", error);
  }
};
start();
