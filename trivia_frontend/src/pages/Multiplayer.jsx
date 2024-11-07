import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../services/socketService";
import {
  Box,
  VStack,
  Heading,
  Button,
  Input,
  Text,
  HStack,
  useToast,
  Card,
  CardBody,
  Badge,
} from "@chakra-ui/react";
import { getUser } from "../services/UserService";

const GameComponent = () => {
  const navigate = useNavigate();
  const [gameRoom, setGameRoom] = useState("");
  const [players, setPlayers] = useState([]);
  const [gameStatus, setGameStatus] = useState("waiting");
  const [isHost, setIsHost] = useState(false);
  const toast = useToast();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        if (!userId || !token) {
          console.error("Missing user ID or token");
          navigate("/login");
          return;
        }

        const user = await getUser(userId, token);
        if (user && user.fullName) {
          setUserName(user.fullName);
        } else {
          throw new Error("Invalid user data received");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        toast({
          title: "Error fetching profile",
          description: error.message || "Please try logging in again",
          status: "error",
          duration: 3000,
        });
        navigate("/login");
      }
    };

    fetchUserName();

    if (!socket.connected) {
      socket.connect();
    }

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("roomCreated", ({ roomCode }) => {
      console.log("Room created:", roomCode);
      setGameRoom(roomCode);
      setIsHost(true);
      localStorage.setItem("currentGameRoom", roomCode);
      toast({
        title: `Room created! Code: ${roomCode}`,
        description: "Share this code with other players",
        status: "success",
        duration: 5000,
      });
    });

    socket.on("joinedRoom", ({ players: updatedPlayers, roomCode }) => {
      console.log("Joined room:", roomCode, "Players:", updatedPlayers);
      setPlayers(updatedPlayers);
      setGameRoom(roomCode);
      localStorage.setItem("currentGameRoom", roomCode);
      toast({
        title: "Joined room successfully!",
        status: "success",
        duration: 2000,
      });
    });

    socket.on("playersUpdate", (updatedPlayers) => {
      console.log("Players updated:", updatedPlayers);
      setPlayers(updatedPlayers);
    });

    socket.on("gameStatusUpdate", ({ status }) => {
      console.log("Game status update:", status, "Current room:", gameRoom);
      setGameStatus(status);

      if (status === "playing") {
        try {
          localStorage.setItem("currentGameRoom", gameRoom);
          localStorage.setItem("gameStatus", "playing");

          const storedRoom = localStorage.getItem("currentGameRoom");
          const storedStatus = localStorage.getItem("gameStatus");

          console.log("Stored game state:", {
            room: storedRoom,
            status: storedStatus,
            currentGameRoom: gameRoom,
          });

          if (storedRoom === gameRoom && storedStatus === "playing") {
            Promise.resolve().then(() => {
              navigate("/game/multi", {
                state: {
                  roomCode: gameRoom,
                  gameStatus: "playing",
                },
              });
            });
          } else {
            throw new Error("Failed to store game state");
          }
        } catch (error) {
          console.error("Error storing game state:", error);
          toast({
            title: "Error starting game",
            description: "Please try again",
            status: "error",
            duration: 3000,
          });
        }
      } else if (status === "waiting") {
        localStorage.removeItem("currentGameRoom");
        localStorage.removeItem("gameStatus");
      }
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    });

    return () => {
      if (gameStatus !== "playing") {
        localStorage.removeItem("currentGameRoom");
        localStorage.removeItem("gameStatus");
      }
      socket.off("connect");
      socket.off("roomCreated");
      socket.off("joinedRoom");
      socket.off("playersUpdate");
      socket.off("gameStatusUpdate");
      socket.off("error");
    };
  }, [navigate, toast, gameRoom]);

  const handleInputChange = (e) => {
    const value = e.target.value
      .replace(/[^A-Za-z0-9]/g, "")
      .toUpperCase()
      .slice(0, 6);
    setGameRoom(value);
  };

  const handleCreateGame = () => {
    if (!userName) {
      toast({
        title: "Error loading profile",
        status: "error",
        duration: 2000,
      });
      return;
    }

    socket.emit("createRoom", { playerName: userName });
  };

  const handleJoinGame = () => {
    if (!userName || !gameRoom) {
      toast({
        title: "Please enter a room code",
        status: "error",
        duration: 2000,
      });
      return;
    }

    socket.emit("joinRoom", { playerName: userName, roomCode: gameRoom });
  };

  const handleStartGame = () => {
    if (!gameRoom) {
      console.error("No room code available");
      toast({
        title: "Error",
        description: "Room code not found",
        status: "error",
        duration: 3000,
      });
      return;
    }

    if (players.length < 2) {
      toast({
        title: "Not enough players",
        description: "Need at least 2 players to start",
        status: "warning",
        duration: 2000,
      });
      return;
    }

    console.log("Starting game for room:", gameRoom);
    socket.emit("startGame", { roomCode: gameRoom });
  };

  return (
    <Box p={8}>
      <VStack spacing={8} align="stretch">
        <Heading textAlign="center">Multiplayer Trivia</Heading>
        <Card>
          <CardBody>
            <VStack spacing={4}>
              <Input
                placeholder="Enter game room code"
                value={gameRoom}
                onChange={handleInputChange}
                isDisabled={players.length > 0}
                maxLength={6}
                textTransform="uppercase"
                autoComplete="off"
              />
              <HStack spacing={4}>
                <Button
                  colorScheme="blue"
                  onClick={handleCreateGame}
                  isDisabled={players.length > 0}
                >
                  Create Game
                </Button>
                <Button
                  colorScheme="green"
                  onClick={handleJoinGame}
                  isDisabled={players.length > 0}
                >
                  Join Game
                </Button>
                {isHost && (
                  <Button
                    colorScheme="purple"
                    onClick={handleStartGame}
                    isDisabled={players.length < 2 || !gameRoom}
                  >
                    Start Game
                  </Button>
                )}
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        {/* Player Slots */}
        <Card>
          <CardBody>
            <VStack spacing={4}>
              <Heading size="md">Players ({players.length}/4)</Heading>
              {players.map((player) => (
                <Card
                  key={player.id}
                  width="100%"
                  bg={player.isHost ? "purple.50" : "gray.50"}
                  borderWidth={2}
                  borderColor={player.isHost ? "purple.200" : "gray.200"}
                >
                  <CardBody>
                    <HStack justify="space-between">
                      <Text>{player.name}</Text>
                      {player.isHost && (
                        <Badge colorScheme="purple">Host</Badge>
                      )}
                    </HStack>
                  </CardBody>
                </Card>
              ))}
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};

export default GameComponent;
