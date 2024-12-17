import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../services/SocketService";
import Search from "../components/Search/Search";
import { getNamespaceSocket, connectNamespaceSocket } from "../services/SocketService";
import usePlayerStore from "../stores/playerStore";
import useInvitationStatusStore from "../stores/invitationStatusStore";


import {
  Box,
  VStack,
  Heading,
  Button,
  Text,
  HStack,
  useToast,
  Card,
  CardBody,
  Badge,
  Select,
} from "@chakra-ui/react";

import { getUser } from "../services/UserService";

const GameComponent = () => {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState("easy");
  const [gameRoom, setGameRoom] = useState("");
  const [players, setPlayers] = useState([]);
  const [gameStatus, setGameStatus] = useState("waiting");
  const [isHost, setIsHost] = useState(false);
  const toast = useToast();
  const [userName, setUserName] = useState("");
  localStorage.setItem("difficulty", difficulty);
  const userSocket = getNamespaceSocket("/user");
  const user_id = localStorage.getItem("userId");
  const selectedPlayers = usePlayerStore((state) => state.selectedPlayers);
  const clearPlayers = usePlayerStore((state) => state.clearPlayers);
  const setInvitationStatus = useInvitationStatusStore((state) => state.setInvitationStatus);


  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");
        const user = await getUser(userId, token);
        setUserName(user.fullName);
      } catch (error) {
        console.error("Error fetching user:", error);
        toast({
          title: "Error fetching profile",
          status: "error",
          duration: 3000,
        });
      }
    };

    fetchUserName();

    const currentRoom = localStorage.getItem("currentGameRoom");
    if (currentRoom) {
      setGameRoom(currentRoom);
    }

    connectNamespaceSocket("/user");

    // Re-register the user after page refresh
    userSocket.on('connect', () => {
      if (user_id) {
        userSocket.emit('user-online', Number(user_id));
        console.log('Re-registered user:', user_id);
      }
    });
   
    if (userSocket) {
      userSocket.emit("user-invited", selectedPlayers.map((player) => player.id), user_id);
      console.log("Invited players: ", selectedPlayers.map((player) => player.id));
      userSocket.on("in-app-messaging", (message) => {
        console.log("Message received:", message);
        setInvitationStatus(message.status, message.userId);
        toast({
          title: "In-App Messaging",
          description: message.message,
          status: "info",
          duration: 5000,
        });
      });
    }

    if (!socket.connected) {
      socket.connect();
    }

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("roomCreated", ({ roomCode }) => {
      // console.log("Room created:", roomCode);
      setGameRoom(roomCode);
      setIsHost(true);
      localStorage.setItem("currentGameRoom", roomCode);
      localStorage.setItem("isHost", true);
      toast({
        title: `Room created! Code: ${roomCode}`,
        description: "Share this code with other players",
        status: "success",
        duration: 5000,
      });
      userSocket.emit("invitation", {userName, roomCode, user_id}, user_id);
    });

    socket.on("joinedRoom", ({ players: updatedPlayers, roomCode, isHost }) => {
      // console.log("Joined room:", roomCode, "Players:", updatedPlayers);
      setPlayers(updatedPlayers);
      setGameRoom(roomCode);
      setIsHost(isHost);
      localStorage.setItem("isHost", isHost);
      toast({
        title: "Joined room successfully!",
        status: "success",
        duration: 2000,
      });
    });

    socket.on("gameEnded", () => {
      console.log("Game ended by host.");
      localStorage.removeItem("currentGameRoom");
      localStorage.removeItem("gameStatus");
      localStorage.removeItem("isHost");
      localStorage.removeItem("difficulty");
      clearPlayers();
      navigate("/multiplayer");
      window.location.reload();
    });

    socket.on("playersUpdate", ({ players: updatedPlayers }) => {
      // console.log("Players updated:", updatedPlayers);
      setPlayers(updatedPlayers);

      const currentPlayer = updatedPlayers.find((p) => p.id === socket.id);
      if (currentPlayer) {
        setIsHost(currentPlayer.isHost);
        localStorage.setItem("isHost", currentPlayer.isHost);
      }
    });

    socket.on("gameStatusUpdate", ({ status }) => {
      // console.log("Game status update:", status, "Current room:", gameRoom);
      setGameStatus(status);

      if (status === "playing") {
        // console.log("Game starting, storing state and navigating");
        localStorage.setItem("currentGameRoom", gameRoom);
        localStorage.setItem("gameStatus", "playing");
        setTimeout(() => {
          navigate("/game/multi");
        }, 100);
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
      socket.off("connect");
      socket.off("roomCreated");
      socket.off("joinedRoom");
      socket.off("playersUpdate");
      socket.off("gameStatusUpdate");
      socket.off("error");
      userSocket.off("connect");
      userSocket.off("invitation");
      userSocket.off("in-app-messaging");
      userSocket.off("user-invited");
      userSocket.off("user-online");
    };
  }, [navigate, toast, gameRoom, gameStatus, userSocket, selectedPlayers, players]);


  const handleCreateGame = () => {
    if (!userName) {
      toast({
        title: "Error loading profile",
        status: "error",
        duration: 2000,
      });
      return;
    }

    localStorage.setItem("gameStatus", gameStatus);
    socket.emit("createRoom", { playerName: userName });
  };

  // TBD: Consider to remove this feature. Handler for the text field to join a game.
  // const handleJoinGame = () => {
  //   if (!userName || !gameRoom) {
  //     toast({
  //       title: "Please enter a room code",
  //       status: "error",
  //       duration: 2000,
  //     });
  //     return;
  //   }

  //   localStorage.setItem("currentGameRoom", gameRoom);
  //   socket.emit("joinRoom", { playerName: userName, roomCode: gameRoom });
  // };

  const handleStartGame = () => {
    if (players.length < 2) {
      toast({
        title: "Not enough players",
        description: "Need at least 2 players to start",
        status: "warning",
        duration: 2000,
      });
      return;
    }

    if (!gameRoom) {
      console.error("No room code available");
      return;
    }

    localStorage.setItem("currentGameRoom", gameRoom);
    localStorage.setItem("gameStatus", "playing");
    socket.emit("startGame", { roomCode: gameRoom, difficulty });
  };

  const handleEndGame = () => {
    const roomCode = localStorage.getItem("currentGameRoom");
    if (!roomCode) return;
    localStorage.removeItem("gameStatus");
    localStorage.removeItem("isHost");
    localStorage.removeItem("difficulty");
    clearPlayers();
    socket.emit("endGame", { roomCode });
    localStorage.removeItem("currentGameRoom");
    setGameRoom("");
    setPlayers([]);
    setIsHost(false);
    window.location.reload();
  };

  const handleSelectDifficulty = (e) => {
    e.preventDefault();
    setDifficulty(e.target.value);
  };

  return (
    <Box p={8} height="100vh" overflowY="auto">
      <VStack spacing={8} align="stretch">
        <Text textAlign="center" fontSize={'xl'} as={'b'}>Multiplayer Quizzard</Text>
        <Card>
          <CardBody>
            <VStack spacing={2}>
              <Text as={'b'} fontSize={'sm'} alignSelf={'flex-start'}>Game difficulty:</Text>
              <Select
                onChange={handleSelectDifficulty}
                value={difficulty}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </Select>
              <Text as={'b'} fontSize={'sm'} alignSelf={'flex-start'}>Invite people:</Text>
              <Search />
              {/* <Text as={'b'} fontSize={'sm'} alignSelf={'flex-start'}>Enter room code or click "Create Game":</Text>
              <Input
                placeholder="Enter game room code"
                value={gameRoom}
                onChange={(e) => setGameRoom(e.target.value)}
                isDisabled={players.length > 0}
              /> */}
              <HStack spacing={4}>
                <Button
                  colorScheme="blue"
                  onClick={handleCreateGame}
                  isDisabled={players.length > 0 || gameRoom || selectedPlayers.length < 1}
                >
                  Create Game
                </Button>
                {/* <Button
                  colorScheme="green"
                  onClick={handleJoinGame}
                  isDisabled={players.length > 0}
                >
                  Join Game
                </Button> */}
                {isHost && (
                  <>
                  <Button
                    colorScheme="purple"
                    onClick={handleStartGame}
                    isDisabled={players.length < 2 || !gameRoom}
                  >
                    Start Game
                  </Button>
                  <Button colorScheme="teal" onClick={handleEndGame}>
                    Reset Game
                  </Button>
                  </>
                )}
                {/* <Button onClick={handleSendInvite}>
                  Send invite
                </Button> */}
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
                  bg={player.isHost ? "brand.50" : "brand.50"}
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
