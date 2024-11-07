import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
  withCredentials: true,
  transports: ["websocket", "polling"],
});

socket.on("connect", () => {
  console.log("Socket connected");

  // Try to restore game state on reconnection
  const currentRoom = localStorage.getItem("currentGameRoom");
  const gameStatus = localStorage.getItem("gameStatus");

  if (currentRoom && gameStatus === "playing") {
    console.log("Attempting to rejoin room after connection:", currentRoom);
    socket.emit("rejoinGame", { roomCode: currentRoom });
  }
});

socket.on("disconnect", () => {
  console.log("Socket disconnected");
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error);
  // Try to reconnect with polling if websocket fails
  if (socket.io.opts.transports.includes("websocket")) {
    console.log("Retrying with polling transport");
    socket.io.opts.transports = ["polling"];
    socket.connect();
  }
});

export default socket;
