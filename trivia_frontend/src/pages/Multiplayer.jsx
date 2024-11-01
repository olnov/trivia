import { useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3001"); // Use backend URL

function GameComponent() {
  useEffect(() => {
    socket.emit("joinGame", "gameRoom1"); // Example game room

    socket.on("updateGame", (data) => {
      console.log("Game update:", data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>Multiplayer Game</h1>
    </div>
  );
}

export default GameComponent;
