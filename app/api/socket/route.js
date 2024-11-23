// app/api/socket/route.js
import { Server } from "socket.io";
import { NextResponse } from "next/server";

export const GET = (req, res) => {
  // Check if the socket server is already set up
  if (res.socket.server.io) {
    console.log("Socket is already set up");
    return NextResponse.json({ status: "Socket already running" });
  }

  // Create a new Socket.IO server instance
  const io = new Server(res.socket.server, {
    path: "/api/socketio", // Ensure this matches the client connection
    cors: {
      origin: "*", // Set your CORS policy
      methods: ["GET", "POST"],
    },
  });

  // Handle socket connections
  io.on("connection", (socket) => {
    console.log("New client connected");

    // Example of broadcasting a message
    socket.on("sendMessage", (message) => {
      io.emit("receiveMessage", message);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  // Assign the Socket.IO server instance to the Next.js server
  res.socket.server.io = io;

  return NextResponse.json({ status: "Socket initialized" });
};
