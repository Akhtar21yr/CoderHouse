require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const server = require("http").createServer(app);
const router = require("./routes");
const dbConnect = require("./database");
const ACTION = require("./actions");
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});
dbConnect();
const PORT = process.env.PORT || 5500;
app.use(cookieParser());
app.use(express.json());
app.use("/storage", express.static("storage"));
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173"],
  })
);
app.use(router);
app.get("/", (req, res) => {
  res.send("Hello world");
});

const socketUserMapping = {};

io.on("connection", (socket) => {
  socket.on(ACTION.JOIN, ({ roomId, user }) => {
    socketUserMapping[socket.id] = user;
    const room = io.sockets.adapter.rooms.get(roomId);
    const clients = room ? Array.from(room) : [];
    clients.forEach((clientId) => {
      io.to(clientId).emit(ACTION.ADD_PEER, {});
    });

    socket.emit(ACTION.ADD_PEER)

    socket.join(roomId);
  });
});

server.listen(PORT, () => console.log(`Running on port ${PORT}`));
