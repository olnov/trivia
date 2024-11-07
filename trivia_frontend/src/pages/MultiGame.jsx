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

  useEffect(() => {
    const currentRoom = localStorage.getItem("currentGameRoom");
    const gameStatus = localStorage.getItem("gameStatus");

    console.log("MultiGame mounted. Room:", currentRoom, "Status:", gameStatus);

    const checkGameStatus = () => {
      const room = localStorage.getItem("currentGameRoom");
      const status = localStorage.getItem("gameStatus");

      if (!room || status !== "playing") {
        console.error("No room code or invalid game status");
        navigate("/multiplayer");
        return false;
      }
      return true;
    };

    let retries = 3;
    const tryCheckStatus = () => {
      if (checkGameStatus() || retries <= 0) {
        if (retries > 0) {
          setRoomCode(currentRoom);
          setupSocketConnection();
        }
      } else {
        retries--;
        setTimeout(tryCheckStatus, 100);
      }
    };

    const setupSocketConnection = () => {
      if (!socket.connected) {
        socket.connect();
      }

      setupSocketListeners();
      console.log("Attempting to rejoin game:", currentRoom);
      socket.emit("rejoinGame", { roomCode: currentRoom });
    };

    const setupSocketListeners = () => {
      socket.on("gameQuestion", ({ question, options, questionIndex }) => {
        console.log("Received question:", question, "Index:", questionIndex);
        setQuestion({
          text: decodeHTMLEntities(question),
          options: options.map((opt) => decodeHTMLEntities(opt)),
        });
        setCurrentQuestionIndex(questionIndex);
        setTimeLeft(15);
        setSelectedAnswer(null);
      });

      socket.on("timeUpdate", ({ timeLeft }) => {
        setTimeLeft(timeLeft);
      });

      socket.on("scoreUpdate", ({ players }) => {
        console.log("Score update received:", players);
        setPlayers(players);
        const currentPlayer = players.find((p) => p.id === socket.id);
        if (currentPlayer) {
          console.log("Updated score:", currentPlayer.score);
        }
      });

      socket.on("gameOver", ({ finalScores }) => {
        setGameFinished(true);
        setPlayers(finalScores);
      });

      socket.on("error", ({ message }) => {
        console.error("Game error:", message);
        toast({
          title: "Game Error",
          description: message,
          status: "error",
          duration: 3000,
        });
      });
    };

    tryCheckStatus();

    return () => {
      if (gameFinished) {
        localStorage.removeItem("currentGameRoom");
        localStorage.removeItem("gameStatus");
      }
      socket.off("gameQuestion");
      socket.off("timeUpdate");
      socket.off("scoreUpdate");
      socket.off("gameOver");
      socket.off("error");
    };
  }, [navigate, toast]);

  const decodeHTMLEntities = (text) => {
    const textArea = document.createElement("textarea");
    textArea.innerHTML = text;
    return textArea.value;
  };

  const handleAnswerSubmit = (selectedAnswer) => {
    if (!question || timeLeft <= 0 || !roomCode) {
      console.log("Cannot submit answer:", { question, timeLeft, roomCode });
      return;
    }

    console.log(
      "Submitting answer:",
      selectedAnswer,
      "for question:",
      currentQuestionIndex,
      "Room:",
      roomCode
    );

    setSelectedAnswer(selectedAnswer);

    socket.emit("submitAnswer", {
      answer: selectedAnswer,
      roomCode: roomCode,
      questionIndex: currentQuestionIndex,
    });
  };

  const handlePlayAgain = () => {
    if (!roomCode) {
      console.error("No room code available");
      return;
    }
    console.log("Requesting play again for room:", roomCode);
    socket.emit("playAgain", { roomCode });
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
                <Button colorScheme="blue" size="lg" onClick={handlePlayAgain}>
                  Play Again
                </Button>
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
