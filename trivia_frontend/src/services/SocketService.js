import { io } from "socket.io-client";

// Default root namespace socket (backward compatible)
const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:3000", {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 10000,
  transports: ["websocket"],
});

let reconnectTimer = null;
let currentRoom = null;

// Maintain separate namespace sockets
const namespaceSockets = {};

// Handle default socket events (root namespace)
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

socket.on("gameOver", ({ finalScores }) => {
  console.log("Game over event received.", finalScores);
  const gameOverEvent = new CustomEvent("gameOver", { detail: { finalScores } });
  window.dispatchEvent(gameOverEvent);
});

socket.on("gameEnded", () => {
  console.log("Game ended by host.");
  currentRoom = null;
  localStorage.removeItem("currentGameRoom");
  localStorage.removeItem("gameStatus");
  localStorage.removeItem("isHost");

  const gameEndedEvent = new CustomEvent("gameEnded");
  window.dispatchEvent(gameEndedEvent);
});

socket.io.on("ping_timeout", () => {
  console.log("Ping timeout - attempting reconnection");
  socket.connect();
});

// Utility function to create or retrieve namespace sockets
export const getNamespaceSocket = (namespace = "/") => {
  if (!namespaceSockets[namespace]) {
    const namespaceSocket = io(`${import.meta.env.VITE_SOCKET_URL || "http://localhost:3000"}${namespace}`, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000,
      transports: ["websocket"],
    });

    namespaceSocket.on("connect", () => {
      console.log(`Socket connected to namespace ${namespace}:`, namespaceSocket.id);
    });

    namespaceSocket.on("disconnect", (reason) => {
      console.log(`Socket disconnected from namespace ${namespace}. Reason:`, reason);
    });

    namespaceSocket.on("connect_error", (error) => {
      console.error(`Socket connection error in namespace ${namespace}:`, error);
    });

    namespaceSockets[namespace] = namespaceSocket;
  }

  return namespaceSockets[namespace];
};

// Functions for managing namespace sockets
export const connectNamespaceSocket = (namespace) => {
  const namespaceSocket = getNamespaceSocket(namespace);
  if (!namespaceSocket.connected) {
    namespaceSocket.connect();
  }
};

export const disconnectNamespaceSocket = (namespace) => {
  const namespaceSocket = namespaceSockets[namespace];
  if (namespaceSocket && namespaceSocket.connected) {
    namespaceSocket.disconnect();
  }
};

// Exported functions for managing default socket (root namespace)
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

// Default export for backward compatibility
export default socket;
