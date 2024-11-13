import io from "socket.io-client";

const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:3000", {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 10000,
  transports: ["websocket", "polling" ],
});

let reconnectTimer = null;
let currentRoom = null;

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }

  if (currentRoom || localStorage.getItem("currentGameRoom")) {
    const roomToJoin = currentRoom || localStorage.getItem("currentGameRoom");
    console.log("Attempting to rejoin room after reconnect:", roomToJoin);
    socket.emit("rejoinGame", { roomCode: roomToJoin });
  }
});

socket.on("disconnect", (reason) => {
  console.log("Socket disconnected. Reason:", reason);

  if (localStorage.getItem("gameStatus") === "playing") {
    if (!reconnectTimer) {
      reconnectTimer = setTimeout(() => {
        console.log("Attempting to reconnect...");
        socket.connect();
      }, 1000);
    }
  }
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error);
});

socket.on("error", ({ message }) => {
  console.error("Socket error:", message);
});

socket.on("joinedRoom", ({ roomCode }) => {
  currentRoom = roomCode;
});

socket.on("gameOver", () => {
  console.log("Game over event received.");
});

socket.on("gameEnded", () => {
  console.log("Game ended by host.");
  currentRoom = null;
  localStorage.removeItem("currentGameRoom");
  localStorage.removeItem("gameStatus");
  localStorage.removeItem("isHost");
});

socket.io.on("ping_timeout", () => {
  console.log("Ping timeout - attempting reconnection");
  socket.connect();
});

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  currentRoom = null;
  if (socket.connected) {
    socket.disconnect();
  }
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
};

export default socket;
