const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server);

// Define port
const PORT = process.env.PORT || 3001;

// Serve the React app or any other frontend from a 'public' directory if needed
app.use(express.static("public"));

// WebSocket connection handling
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Join a room for multiplayer game sessions
  socket.on("joinGame", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room: ${roomId}`);
  });

  // Handle game data exchange, e.g., sending answers
  socket.on("playerMove", (data) => {
    const { roomId, move } = data;
    socket.to(roomId).emit("updateGame", { playerId: socket.id, move });
  });

  // Disconnect handling
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
