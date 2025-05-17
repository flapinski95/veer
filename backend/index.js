const express = require("express");
const db = require("./models");
const User = db.User;

const http = require("http")
const {Server} = require('socket.io')

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',  
  }
});

const loginRoutes = require("../backend/routes/login");
const oauthRoutes = require("../backend/routes/oauth");
const registerRoutes = require("../backend/routes/register")(io);
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
    const connectedUsers = new Map();

    io.on('connection', (socket) => {
      console.log('Połączono:', socket.id);

      socket.on('watchUser', (userId) => {
        socket.join(userId);
        connectedUsers.set(userId, socket.id); 
      });

      socket.on('disconnect', () => {
        console.log('Rozłączono:', socket.id);
        for (const [userId, socketId] of connectedUsers.entries()) {
          if (socketId === socket.id) {
            connectedUsers.delete(userId);
            break;
          }
        }
      });
    });

    server.listen(PORT, () => console.log("server running on " + PORT));
    // app.listen(PORT, () => console.log("server running on" + PORT));
  } catch (error) {
    console.error("error", error);
  }
};
start();
