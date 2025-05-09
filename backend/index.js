const express = require("express");
const db = require("./models");

const app = express();

const PORT = 3000;
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello");
});

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
