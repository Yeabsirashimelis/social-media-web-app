import { Server } from "socket.io";
import http from "http";

const handler = (req, res) => {
  if (res.socket.server.io) {
    console.log("socket is already set up");
    res.end();
    return;
  }

  const httpServer = http.createServer(res.socket.server);
  const io = new Server(httpServer, {
    path: "/api/socketio",
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });

  io.on("connection", (socket) => {
    console.log("new client connected");

    //handle disconnection
    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  res.socket.server.io = io;
  res.end();
};

export default handler;
