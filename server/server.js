require("dotenv").config();
const express = require("express");
const cors = require("cors");
const router = require("./routes");
const connect = require("./database/db");
const cookieparser = require("cookie-parser");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    // allowedHeaders:["Content-Type","Authorization"],
    // credentials
  },
});
app.use(cookieparser());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],

    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
const port = process.env.PORT || 5000;
connect();
app.use(express.json());
app.use("/apiv1", router);
const socketMap = {};
io.on("connection", (socket) => {
  console.log("User connected", socket.id);
  socket.on("join-room", ({ roomId, user }) => {
    socket.join(roomId);
    console.log("room id", roomId);
    const participantsList = Array.from(
      io?.sockets?.adapter?.rooms?.get(roomId)
    );

    participantsList.forEach((participant) => {
      if (participant != socket.id) {
        console.log("socket",socket.id)
        io.to(participant).emit("user-connected", {
          socketId: socket.id,
          user,
          createOffer: false,
        });
        console.log("participant", participant);
        console.log(socketMap[participant]);
        socket.emit("user-connected", {
          socketId: participant,
          createOffer: true,
          user: socketMap[participant],
        });
      }
    });
    socketMap[socket.id] = user;
    socket.join(roomId);
    console.log("User joined room");
  });

  //handling ice info
  socket.on("ice_info", ({ roomId, socketId, ice }) => {
    io.to(socketId).emit("ice_info", { socketId: socket.id, ice });
  });

  //handling offer
  socket.on("send_offer", ({ roomId, socketId, offer }) => {
    io.to(socketId).emit("send_offer", { socketId: socket.id, offer });
  });
  socket.on("user-disconnected", ({ roomId, user }) => {
    const { rooms } = socket;
    Array.from(rooms).forEach((room) => {
      const participants = Array.from(io.sockets.adapter.rooms.get(room));
      participants.forEach((participant) => {
        io.to(participant).emit("user-disconnected", {
          socketId: socket.id,
          user: socketMap[socket.id],
        }); //to remove from others list
        socket.emit("user-disconnected", {
          socketId: participant,
          user: socketMap[participant],
        }); //to remove others from our list
      });
    });

    socket.leave(roomId);
    delete socketMap[socket.id];
  });
  // socket.on("disconnecting") yet to execute it
});

server.listen(port, () => {
  console.log("Server is running on port 5000");
});
