const { Server } = require("socket.io");
const fetch = require("node-fetch");

// Store active game rooms
const gameRooms = new Map();
const activeGames = new Map();

// Utility functions
const generateRoomCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

const fetchQuestions = async (difficulty) => {
  try {
    const response = await fetch(
      `https://opentdb.com/api.php?amount=10&difficulty=${difficulty}&type=multiple`
    );
    const data = await response.json();

    if (data.response_code === 0 && data.results && data.results.length > 0) {
      console.log("Successfully fetched", data.results.length, "questions");
      return data.results;
    } else {
      console.error("Invalid response from trivia API:", data);
      return null;
    }
  } catch (error) {
    console.error("Error fetching questions:", error);
    return null;
  }
};

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Game Logic Functions
const sendQuestion = (io, roomCode) => {
  const room = gameRooms.get(roomCode);
  if (!room || !room.questions) {
    console.error("Room or questions not found for room:", roomCode);
    return;
  }

  const question = room.questions[room.currentQuestion];
  if (!question) {
    console.error("Question not found for index:", room.currentQuestion);
    return;
  }

  console.log(
    "Sending question to room:",
    roomCode,
    "Index:",
    room.currentQuestion
  );
  const options = shuffleArray([
    ...question.incorrect_answers,
    question.correct_answer,
  ]);

  io.to(roomCode).emit("gameQuestion", {
    question: question.question,
    options: options,
    questionIndex: room.currentQuestion,
  });
};

const startTimer = (io, roomCode) => {
  const game = activeGames.get(roomCode);
  const room = gameRooms.get(roomCode);
  if (!game || !room) {
    console.log("Cannot start timer - game or room not found");
    return;
  }

  // Clear any existing timer
  if (game.timer) {
    clearInterval(game.timer);
  }

  game.timeLeft = 15;
  io.to(roomCode).emit("timeUpdate", { timeLeft: game.timeLeft });

  game.timer = setInterval(() => {
    game.timeLeft--;
    io.to(roomCode).emit("timeUpdate", { timeLeft: game.timeLeft });

    if (game.timeLeft <= 0) {
      clearInterval(game.timer);
      handleQuestionTimeout(io, roomCode);
    }
  }, 1000);
};

const handleQuestionTimeout = (io, roomCode) => {
  const room = gameRooms.get(roomCode);
  if (!room) return;

  // Auto-submit empty answers for players who haven't answered
  room.players.forEach((player) => {
    if (!player.answers) {
      player.answers = [];
    }
    if (player.answers.length <= room.currentQuestion) {
      player.answers.push({ answer: null, isCorrect: false });
    }
  });

  room.currentQuestion++;

  if (room.currentQuestion >= room.questions.length) {
    gameOver(io, roomCode);
  } else {
    sendQuestion(io, roomCode);
    startTimer(io, roomCode);
  }
};

// Added split of endGame and gameOver
// gameOver handles the round play results,
// while endGame closes the room, resets all the game statuses
const endGame = (io, roomCode) => {
  const room = gameRooms.get(roomCode);
  if (!room) return;

  console.log(`End game processing for room: ${roomCode}`);

  io.to(roomCode).emit("gameEnded");

  // Clean up the room and active games
  activeGames.delete(roomCode);
  gameRooms.delete(roomCode);
  console.log("Room deleted:", roomCode);
};

const gameOver = (io, roomCode) => {
  const room = gameRooms.get(roomCode);
  if (!room) return;

  console.log(`Game over processing for room: ${roomCode}`);

  const game = activeGames.get(roomCode);
  if (game?.timer) {
    clearInterval(game.timer);
  }
  io.to(roomCode).emit("gameOver", { finalScores: room.players });
  room.status = "finished";
};

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "https://trivia-react-latest.onrender.com",
      ],
    },
  });

  // Log connection errors
  io.engine.on("connection_error", (err) => {
    console.log("Connection error occurred:");
    console.log("Error code:", err.code);
    console.log("Error message:", err.message);
    console.log("Error context:", err.context);
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    let currentRoom = null;

    // Handle room creation
    socket.on("createRoom", ({ playerName, difficulty }) => {
      if (currentRoom) {
        console.log("Player already in a room:", socket.id);
        return;
      }

      const roomCode = generateRoomCode();
      const player = {
        id: socket.id,
        name: playerName,
        isHost: true,
        score: 0,
        answers: [],
      };

      gameRooms.set(roomCode, {
        players: [player],
        status: "waiting",
        questions: null,
        currentQuestion: 0,
        difficulty,
      });

      currentRoom = roomCode;
      socket.join(roomCode);
      socket.emit("roomCreated", { roomCode });
      console.log("Room created:", roomCode);
      socket.emit("joinedRoom", {
        players: [player],
        roomCode,
        isHost: player.isHost,
      });
    });

    // Handle joining rooms
    socket.on("joinRoom", ({ playerName, roomCode }) => {
      console.log("Join room attempt:", roomCode, "Player:", playerName);

      if (currentRoom) {
        console.log("Player already in a room:", socket.id);
        socket.emit("error", { message: "You are already in a room" });
        return;
      }

      const room = gameRooms.get(roomCode);
      if (!room) {
        socket.emit("error", { message: "Room not found" });
        return;
      }

      if (room.status !== "waiting") {
        socket.emit("error", { message: "Game already in progress" });
        return;
      }

      if (room.players.length >= 4) {
        socket.emit("error", { message: "Room is full" });
        return;
      }

      const player = {
        id: socket.id,
        name: playerName,
        isHost: false,
        score: 0,
        answers: [],
      };

      room.players.push(player);
      currentRoom = roomCode;
      socket.join(roomCode);
      io.to(roomCode).emit("playersUpdate", { players: room.players });
      socket.emit("joinedRoom", {
        players: room.players,
        roomCode,
        isHost: player.isHost,
      });
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      if (!currentRoom) return;

      const room = gameRooms.get(currentRoom);
      if (!room) return;

      const playerIndex = room.players.findIndex((p) => p.id === socket.id);
      if (playerIndex === -1) return;

      room.players.splice(playerIndex, 1);

      if (room.players.length === 0) {
        console.log("Room empty, deleting:", currentRoom);
        gameRooms.delete(currentRoom);
        activeGames.delete(currentRoom);
      } else {
        // If host left, assign new host
        if (!room.players.some((p) => p.isHost)) {
          room.players[0].isHost = true;
        }
        io.to(currentRoom).emit("playersUpdate", { players: room.players });
      }

      socket.leave(currentRoom);
    });

    // Handle rejoin attempts
    socket.on("rejoinGame", ({ roomCode }) => {
      console.log("Player attempting to rejoin game:", roomCode);
      const room = gameRooms.get(roomCode);

      if (!room) {
        console.error("Room not found for rejoin:", roomCode);
        socket.emit("error", { message: "Game room not found" });
        return;
      }

      // Join the socket to the room
      socket.join(roomCode);

      // If game is in progress, send current question
      if (room.status === "playing" && room.questions) {
        const currentQuestion = room.questions[room.currentQuestion];
        const options = shuffleArray([
          ...currentQuestion.incorrect_answers,
          currentQuestion.correct_answer,
        ]);

        // Send current game state to rejoining player
        socket.emit("gameQuestion", {
          question: currentQuestion.question,
          options: options,
          questionIndex: room.currentQuestion,
        });

        // Send current scores
        socket.emit("scoreUpdate", { players: room.players });

        // Send current timer
        const game = activeGames.get(roomCode);
        if (game) {
          socket.emit("timeUpdate", { timeLeft: game.timeLeft });
        }
      }
    });

    // Handle game start
    socket.on("startGame", async ({ roomCode, difficulty }) => {
      console.log("Starting game for room:", roomCode);
      console.log("Selected difficulty:", difficulty);
      const room = gameRooms.get(roomCode);
      if (!room) {
        console.error("Room not found:", roomCode);
        return;
      }

      if (room.status === "playing") {
        console.error("Game already in progress");
        return;
      }

      try {
        console.log("Fetching questions...");
        const questions = await fetchQuestions(difficulty);
        if (!questions || questions.length === 0) {
          throw new Error("Failed to fetch questions");
        }

        // Set up game state before emitting any events
        room.status = "playing";
        room.questions = questions;
        room.currentQuestion = 0;
        room.players = room.players.map((player) => ({
          ...player,
          score: 0,
          answers: [],
        }));

        // Set up game timer
        activeGames.set(roomCode, {
          timer: null,
          timeLeft: 15,
        });

        // Send game status update
        io.to(roomCode).emit("gameStatusUpdate", { status: "playing" });

        // Send first question immediately
        sendQuestion(io, roomCode);

        // Start timer
        startTimer(io, roomCode);
      } catch (error) {
        console.error("Error starting game:", error);
        io.to(roomCode).emit("error", { message: "Failed to start game" });
        room.status = "waiting";
        io.to(roomCode).emit("gameStatusUpdate", { status: "waiting" });
      }
    });

    // Handle answer submission
    socket.on("submitAnswer", ({ answer, roomCode, questionIndex }) => {
      console.log(
        "Answer submitted:",
        answer,
        "Room:",
        roomCode,
        "Index:",
        questionIndex,
        "Player:",
        socket.id
      );

      const room = gameRooms.get(roomCode);
      if (!room || !room.questions) {
        console.error("Room or questions not found");
        return;
      }

      const player = room.players.find((p) => p.id === socket.id);
      if (!player) {
        console.error("Player not found");
        return;
      }

      const question = room.questions[questionIndex];
      if (!question) {
        console.error("Question not found");
        return;
      }

      // Check if player has already answered this question
      if (player.answers.length > questionIndex) {
        console.log("Player already answered this question");
        return;
      }

      const isCorrect = answer === question.correct_answer;
      player.score += isCorrect ? 1 : 0;
      player.answers.push({ answer, isCorrect });

      console.log(
        "Updated player score:",
        player.score,
        "IsCorrect:",
        isCorrect
      );

      // Emit score update to all players
      io.to(roomCode).emit("scoreUpdate", { players: room.players });

      // Check if all players have answered
      const allAnswered = room.players.every(
        (p) => p.answers.length > questionIndex
      );

      if (allAnswered) {
        console.log("All players have answered, moving to next question");
        clearInterval(activeGames.get(roomCode)?.timer);

        if (questionIndex >= room.questions.length - 1) {
          gameOver(io, roomCode);
        } else {
          room.currentQuestion = questionIndex + 1;
          setTimeout(() => {
            sendQuestion(io, roomCode);
            startTimer(io, roomCode);
          }, 2000);
        }
      }
    });

    // Handle play again
    socket.on("playAgain", async ({ roomCode, difficulty }) => {
      console.log("Play again request for room:", roomCode);
      const room = gameRooms.get(roomCode);
      if (!room) {
        socket.emit("error", { message: "Room not found" });
        return;
      }

      try {
        const questions = await fetchQuestions(difficulty);
        if (!questions || questions.length === 0) {
          throw new Error("Failed to fetch questions");
        }

        // Reset room state
        room.status = "playing";
        room.questions = questions;
        room.currentQuestion = 0;
        room.players = room.players.map((player) => ({
          ...player,
          score: 0,
          answers: [],
        }));

        activeGames.set(roomCode, {
          timer: null,
          timeLeft: 15,
        });

        // Notify all players
        io.to(roomCode).emit("gameRestarted");
        io.to(roomCode).emit("playersUpdate", { players: room.players });
        sendQuestion(io, roomCode);
        startTimer(io, roomCode);
      } catch (error) {
        console.error("Error handling play again:", error);
        socket.emit("error", { message: "Failed to restart game" });
      }
    });

    // Handle end game
    socket.on("endGame", ({ roomCode }) => {
      console.log("End game request received for room:", roomCode);
      const room = gameRooms.get(roomCode);
      if (!room) {
        socket.emit("error", { message: "Room not found" });
        return;
      }

      // Verify that the requester is the host
      const isHost = room.players.find((p) => p.id === socket.id && p.isHost);
      if (!isHost) {
        socket.emit("error", { message: "Only the host can end the game" });
        return;
      }

      // Call the endGame function
      endGame(io, roomCode);
    });
  });

  return io;
};

module.exports = setupSocket;
