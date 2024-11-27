import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../services/SocketService";

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
  Center,
  Select,
} from "@chakra-ui/react";

import { getUser } from "../services/UserService";

const GameComponent = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [difficulty, setDifficulty] = useState("");
  const [gameRoom, setGameRoom] = useState("");
  const [players, setPlayers] = useState([]);
  const [gameStatus, setGameStatus] = useState("waiting");
  const [isHost, setIsHost] = useState(false);
  const toast = useToast();
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");

  // const fetchQuestions = async (selectedDifficulty) => {
  //   try {
  //     const response = await fetch(
  //       `https://opentdb.com/api.php?amount=10&difficulty=${selectedDifficulty}&type=multiple`
  //     );
  //     const data = await response.json();
  //     setDifficulty(selectedDifficulty);
  //     setQuestions(data.results);
  //     // setShuffledAnswers(
  //     //   shuffleAnswers(
  //     //     data.results[0].correct_answer,
  //     //     data.results[0].incorrect_answers
  //     //   )
  //     // );
  //     // setPlayerAnswers(Array(data.results.length).fill(null)); // Initialize playerAnswers array
  //   } catch (err) {
  //     setError(err.message || "Failed to fetch questions.");
  //     console.error(err);
  //   }
  // };

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
      localStorage.setItem("isHost", true);
      toast({
        title: `Room created! Code: ${roomCode}`,
        description: "Share this code with other players",
        status: "success",
        duration: 5000,
      });
    });

    socket.on("joinedRoom", ({ players: updatedPlayers, roomCode, isHost }) => {
      console.log("Joined room:", roomCode, "Players:", updatedPlayers);
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

    socket.on("playersUpdate", ({ players: updatedPlayers }) => {
      console.log("Players updated:", updatedPlayers);
      setPlayers(updatedPlayers);

      const currentPlayer = updatedPlayers.find((p) => p.id === socket.id);
      if (currentPlayer) {
        setIsHost(currentPlayer.isHost);
        localStorage.setItem("isHost", currentPlayer.isHost);
      }
    });

    socket.on("gameStatusUpdate", ({ status }) => {
      console.log("Game status update:", status, "Current room:", gameRoom);
      setGameStatus(status);

      if (status === "playing") {
        console.log("Game starting, storing state and navigating");
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
    };
  }, [navigate, toast, gameRoom, gameStatus]);

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

  const handleJoinGame = () => {
    if (!userName || !gameRoom) {
      toast({
        title: "Please enter a room code",
        status: "error",
        duration: 2000,
      });
      return;
    }

    localStorage.setItem("currentGameRoom", gameRoom);
    socket.emit("joinRoom", { playerName: userName, roomCode: gameRoom });
  };

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
    console.log("THIS IS US CHECKING THE ", difficulty);
    socket.emit("startGame", { roomCode: gameRoom, difficulty });
  };

  // if (questions.length === 0) {
  //   return (
  //     <>
  //       <br></br>
  //       <Center>
  //         <Box boxShadow="base" p="6" rounded="md" width={"400px"}>
  //           <div style={{ textAlign: "center" }}>
  //             <Text fontSize={32}>Choose Difficulty</Text>
  //             <br></br>
  //           </div>
  //           <div
  //             style={{
  //               display: "flex",
  //               justifyContent: "center",
  //               gap: "10px",
  //               margin: "20px 0",
  //             }}
  //           >
  //             <Button colorScheme="teal" onClick={() => fetchQuestions("easy")}>
  //               Easy
  //             </Button>
  //             <Button
  //               colorScheme="orange"
  //               onClick={() => fetchQuestions("medium")}
  //             >
  //               Medium
  //             </Button>
  //             <Button colorScheme="red" onClick={() => fetchQuestions("hard")}>
  //               Hard
  //             </Button>
  //           </div>
  //         </Box>
  //       </Center>
  //     </>
  //   );
  // }

  const handleSelectDifficulty = (e) => {
    e.preventDefault();
    setDifficulty(e.target.value);
  };

  return (
    <Box p={8}>
      <VStack spacing={8} align="stretch">
        <Heading textAlign="center">Multiplayer Trivia</Heading>
        <Card>
          <Select
            placeholder="Select difficulty"
            onChange={handleSelectDifficulty}
            value={difficulty}
          >
            <option value="easy" selected>
              Easy
            </option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </Select>

          <CardBody>
            <VStack spacing={4}>
              <Input
                placeholder="Enter game room code"
                value={gameRoom}
                onChange={(e) => setGameRoom(e.target.value)}
                isDisabled={players.length > 0}
              />
              <HStack spacing={4}>
                <Button
                  colorScheme="blue"
                  onClick={handleCreateGame}
                  isDisabled={players.length > 0 || gameRoom}
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
