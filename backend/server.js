require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const server = require("http").createServer(app);
const router = require("./routes");
const dbConnect = require("./database");
const ACTIONS = require("./ACTIONS");
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
  // Handle JOIN event
  socket.on(ACTIONS.JOIN, ({ roomId, user }) => {
    socketUserMapping[socket.id] = user;
    const room = io.sockets.adapter.rooms.get(roomId);
    const clients = room ? Array.from(room) : [];
    clients.forEach((clientId) => {
      // Notify existing clients of the new peer
      io.to(clientId).emit(ACTIONS.ADD_PEER, {
        peerId: socket.id,
        createOffer: false,
        user,
      });

      // Notify the new client of existing peers
      socket.emit(ACTIONS.ADD_PEER, {
        peerId: clientId,
        createOffer: true,
        user: socketUserMapping[clientId],
      });
    });

    socket.join(roomId);
  });

  // Handle ICE Candidate relay
  socket.on(ACTIONS.RELAY_ICE, ({ peerId, icecandidate }) => {
    io.to(peerId).emit(ACTIONS.ICE_CANDIDATE, {
      peerId: socket.id,
      icecandidate,
    });
  });

  // Handle SDP relay
  socket.on(ACTIONS.RELAY_SDP, ({ peerId, sessionDes }) => {
    io.to(peerId).emit(ACTIONS.SESSION_DES, {
      peerId: socket.id,
      sessionDes,
    });
  });

  socket.on(ACTIONS.MUTE, (payload) => {
    console.log("MUTE payload received:", payload);
    const { roomId, userId } = payload || {};
    if (!roomId || !userId) {
      console.error("Invalid payload for MUTE:", payload);
      return;
    }
    // Proceed with mute logic
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
    clients.forEach((clientId) => {
      io.to(clientId).emit(ACTIONS.MUTE, {
        peerId: socket.id,
        userId,
      });
    });
  });

  socket.on(ACTIONS.UNMUTE, (payload) => {
    console.log("unmutwMUTE payload received:", payload);
    const { roomId, userId } = payload || {};
    if (!roomId || !userId) {
      console.error("Invalid payload for unmuteMUTE:", payload);
      return;
    }
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
    clients.forEach((clientId) => {
      io.to(clientId).emit(ACTIONS.UNMUTE, {
        peerId: socket.id,
        userId,
      });
    });
  });

  // Leaving room and cleaning up
  const leaveRoom = () => {
    const rooms = Array.from(socket.rooms); // Get the rooms the socket is part of
    rooms.forEach((roomId) => {
      if (roomId === socket.id) return; // Skip the socket's own room
      const room = io.sockets.adapter.rooms.get(roomId);
      const clients = room ? Array.from(room) : [];
      clients.forEach((clientId) => {
        io.to(clientId).emit(ACTIONS.REMOVE_PEER, {
          peerId: socket.id,
          userId: socketUserMapping[socket.id]?.id,
        });
      });
      socket.leave(roomId);
    });
    delete socketUserMapping[socket.id];
  };

  socket.on(ACTIONS.LEAVE, leaveRoom);
  socket.on("disconnecting", leaveRoom); // Handle disconnection
});

server.listen(PORT, () => console.log(`Running on port ${PORT}`));
