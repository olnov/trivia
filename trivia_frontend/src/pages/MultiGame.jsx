import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  VStack,
  Heading,
  Text,
  Button,
  Card,
  CardBody,
  Badge,
  HStack,
  Progress,
  Container,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  useToast,
} from "@chakra-ui/react";
import socket from "../services/SocketService";

const MultiGame = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [question, setQuestion] = useState(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [players, setPlayers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [roomCode, setRoomCode] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const [isHost, setIsHost] = useState(() => {
    const storedIsHost = localStorage.getItem("isHost");
    return storedIsHost === "true";
  });

  // Decode HTML entities (utility function)
  const decodeHTMLEntities = (text) => {
    const textArea = document.createElement("textarea");
    textArea.innerHTML = text;
    return textArea.value;
  };

  useEffect(() => {
    const currentRoom = localStorage.getItem("currentGameRoom");
    const gameStatus = localStorage.getItem("gameStatus");

    if (!currentRoom || gameStatus !== "playing") {
      navigate("/multiplayer");
      return;
    }

    // Handle gameOver event
    const handleGameOver = ({ finalScores }) => {
      console.log("gameOver event received:", finalScores);
      setGameFinished(true);
      setPlayers([...finalScores]); // Replace players with new array
    };

    // Set up WebSocket listeners
    const setupSocketListeners = () => {
      socket.on("gameRestarted", () => {
        console.log("Game restarted by host.");
        setGameFinished(false);
        setCurrentQuestionIndex(0);
        setQuestion(null);
        setTimeLeft(15);
        setSelectedAnswer(null);

        setPlayers((prevPlayers) =>
          prevPlayers.map((player) => ({
            ...player,
            score: 0,
            answers: [],
          }))
        );

        localStorage.setItem("gameStatus", "playing");
      });

      socket.on("gameQuestion", ({ question, options, questionIndex }) => {
        setQuestion({
          text: decodeHTMLEntities(question),
          options: options.map(decodeHTMLEntities),
        });
        setCurrentQuestionIndex(questionIndex);
        setTimeLeft(15);
        setSelectedAnswer(null);
      });

      socket.on("gameOver", handleGameOver);

      socket.on("gameEnded", () => {
        console.log("Game ended by host.");
        localStorage.removeItem("currentGameRoom");
        localStorage.removeItem("gameStatus");
        localStorage.removeItem("isHost");
        setGameFinished(false);
        setPlayers([]);
        setQuestion(null);
        setTimeLeft(15);
        setSelectedAnswer(null);
        navigate("/multiplayer");
      });

      socket.on("timeUpdate", ({ timeLeft }) => {
        setTimeLeft(timeLeft);
      });

      socket.on("scoreUpdate", ({ players }) => {
        setPlayers(players);
        const currentPlayer = players.find((p) => p.id === socket.id);
        if (currentPlayer) {
          setIsHost(currentPlayer.isHost);
        }
      });

      socket.on("error", ({ message }) => {
        toast({
          title: "Game Error",
          description: message,
          status: "error",
          duration: 3000,
        });
      });
    };

    // Setup socket connection and listeners
    if (!socket.connected) {
      socket.connect();
    }

    setupSocketListeners();
    setRoomCode(currentRoom);
    socket.emit("rejoinGame", { roomCode: currentRoom });

    // Cleanup listeners on unmount
    return () => {
      socket.off("gameRestarted");
      socket.off("gameQuestion");
      socket.off("gameOver", handleGameOver);
      socket.off("gameEnded");
      socket.off("timeUpdate");
      socket.off("scoreUpdate");
      socket.off("error");
    };
  }, [navigate, toast]);

  const handleAnswerSubmit = (selectedAnswer) => {
    if (!question || timeLeft <= 0 || !roomCode) return;

    setSelectedAnswer(selectedAnswer);

    socket.emit("submitAnswer", {
      answer: selectedAnswer,
      roomCode: roomCode,
      questionIndex: currentQuestionIndex,
    });
  };

  const handlePlayAgain = () => {
    if (!roomCode) return;
    localStorage.setItem("gameStatus", "playing");
    socket.emit("playAgain", { roomCode });
    console.log("Play again requested");
  };

  const handleEndGame = () => {
    if (!roomCode) return;
    socket.emit("endGame", { roomCode });
  };

  if (gameFinished) {
    return (
      <Container maxW="container.lg" py={8}>
        <VStack spacing={8} align="stretch">
          <Heading textAlign="center">Game Over!</Heading>
          <Card>
            <CardBody>
              <VStack spacing={6}>
                <Heading size="md">Final Scores</Heading>
                <SimpleGrid columns={2} spacing={4} width="100%">
                  {players
                    .sort((a, b) => b.score - a.score)
                    .map((player, index) => (
                      <Stat
                        key={player.id}
                        bg={index === 0 ? "green.50" : "gray.50"}
                        p={4}
                        borderRadius="md"
                      >
                        <StatLabel>{player.name}</StatLabel>
                        <StatNumber>{player.score} points</StatNumber>
                        <StatHelpText>
                          <StatArrow
                            type={index === 0 ? "increase" : "decrease"}
                          />
                          {index === 0 ? "Winner!" : `Rank #${index + 1}`}
                        </StatHelpText>
                      </Stat>
                    ))}
                </SimpleGrid>
                {isHost && (
                  <>
                    <Button colorScheme="blue" size="lg" onClick={handlePlayAgain}>
                      Play Again
                    </Button>
                    <Button colorScheme="red" size="lg" onClick={handleEndGame}>
                      End Game
                    </Button>
                  </>
                )}
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={6}>
        <Card width="100%">
          <CardBody>
            <VStack spacing={4}>
              <HStack width="100%" justify="space-between">
                <Badge colorScheme="blue" p={2} fontSize="md">
                  Question {currentQuestionIndex + 1}/10
                </Badge>
                <Badge colorScheme="green" p={2} fontSize="md">
                  Time: {timeLeft}s
                </Badge>
              </HStack>
              <Progress
                value={(timeLeft / 15) * 100}
                width="100%"
                colorScheme={timeLeft > 5 ? "green" : "red"}
                size="sm"
                borderRadius="full"
              />
            </VStack>
          </CardBody>
        </Card>

        <Card width="100%">
          <CardBody>
            <VStack spacing={6}>
              <Text fontSize="xl" fontWeight="bold" textAlign="center">
                {question?.text || "Waiting for question..."}
              </Text>
              <SimpleGrid columns={2} spacing={4} width="100%">
                {question?.options?.map((option, index) => (
                  <Button
                    key={index}
                    height="100px"
                    onClick={() => handleAnswerSubmit(option)}
                    isDisabled={timeLeft <= 0 || selectedAnswer !== null}
                    colorScheme={
                      selectedAnswer === option
                        ? "green"
                        : selectedAnswer !== null
                        ? "gray"
                        : "blue"
                    }
                    variant={selectedAnswer === option ? "solid" : "outline"}
                    _hover={{
                      transform: "scale(1.02)",
                    }}
                    transition="all 0.2s"
                  >
                    {option}
                  </Button>
                ))}
              </SimpleGrid>
            </VStack>
          </CardBody>
        </Card>

        <Card width="100%">
          <CardBody>
            <VStack spacing={4}>
              <Heading size="md">Players</Heading>
              <SimpleGrid columns={2} spacing={4} width="100%">
                {players.map((player) => (
                  <Stat
                    key={player.id}
                    bg={player.id === socket.id ? "blue.50" : "gray.50"}
                    p={4}
                    borderRadius="md"
                  >
                    <StatLabel>
                      {player.name}{" "}
                      {player.answers?.length > currentQuestionIndex ? (
                        <Badge colorScheme="green">Answered</Badge>
                      ) : (
                        <Badge colorScheme="yellow">Thinking...</Badge>
                      )}
                    </StatLabel>
                    <StatNumber>{player.score} points</StatNumber>
                    <StatHelpText>
                      {player.answers?.length > 0 && (
                        <>
                          <StatArrow
                            type={
                              player.answers[player.answers.length - 1]
                                .isCorrect
                                ? "increase"
                                : "decrease"
                            }
                          />
                          {player.answers[player.answers.length - 1].isCorrect
                            ? "Correct!"
                            : "Wrong"}
                        </>
                      )}
                    </StatHelpText>
                  </Stat>
                ))}
              </SimpleGrid>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
};

export default MultiGame;
