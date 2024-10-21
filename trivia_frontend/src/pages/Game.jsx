import { Button } from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Game = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [playerAnswers, setPlayerAnswers] = useState([]); // Track player's answers for all questions
  const [shuffledAnswers, setShuffledAnswers] = useState([]); // Store shuffled answers for the current question
  const [time, setTime] = useState(45); // Countdown timer (45 seconds)
  const [correctCount, setCorrectCount] = useState(0); // Track correct answers
  const [incorrectCount, setIncorrectCount] = useState(0); // Track incorrect answers
  const [quizFinished, setQuizFinished] = useState(false); // Track if the quiz has finished
  const [difficulty, setDifficulty] = useState("easy"); // Track difficulty
  const [audioPlayed, setAudioPlayed] = useState(false); // Track if audio has played

  const audioRef = useRef(null);

  // Shuffle the answers for the current question when the question changes
  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      const currentQuestion = questions[currentQuestionIndex];
      const shuffled = shuffleAnswers(
        currentQuestion.correct_answer,
        currentQuestion.incorrect_answers
      );
      setShuffledAnswers(shuffled); // Store shuffled answers for the current question
    }
  }, [currentQuestionIndex, questions]);

  // Shuffle the answers once per question
  const shuffleAnswers = (correctAnswer, incorrectAnswers) => {
    const allAnswers = [...incorrectAnswers, correctAnswer];
    return allAnswers.sort(() => Math.random() - 0.5);
  };

  // Utility function to decode HTML entities
const decodeHTMLEntities = (text) => {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
};

// Modified sendScoreToBackend to ensure correct state capture
const sendScoreToBackend = async () => {
  const timestamp = new Date().toISOString();

  // Ensure that we map over the latest answers after all questions are completed
  const scoreData = questions.map((question, index) => {
    const playersAnswer = playerAnswers[index] || ""; // Get player's answer for this question
    const correctAnswer = decodeHTMLEntities(question.correct_answer); // Decode HTML entities

    // Handle case where player didn't select any answer
    const isCorrect =
      playersAnswer.trim() !== "" &&
      playersAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();

    let scoreMultiplier = 1;
    if (difficulty === "medium") scoreMultiplier = 2;
    if (difficulty === "hard") scoreMultiplier = 3;

    const score = isCorrect ? scoreMultiplier : 0;

    return {
      player_id: localStorage.getItem("userId"),
      players_answer: playersAnswer || "No Answer", // Default to "No Answer" if the player didn't answer
      correct_answer: correctAnswer,
      is_correct: isCorrect,
      difficulty: difficulty,
      score: score,
      answered_at: timestamp,
    };
  });

  console.log("Payload being sent to backend:", scoreData);

  try {
    const response = await fetch("http://localhost:8080/topscores/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(scoreData),
    });

    if (!response.ok) {
      throw new Error("Failed to send score data to backend");
    }

    console.log("Score data successfully sent to backend");
  } catch (error) {
    console.error("Error sending score data:", error);
  }
};  

  const fetchQuestions = async (retryCount = 0, selectedDifficulty) => {
    try {
      const response = await fetch(
        `https://opentdb.com/api.php?amount=10&difficulty=${selectedDifficulty}&type=multiple`
      );
      if (!response.ok) {
        if (retryCount < 3) {
          console.log(`Retrying fetch: Attempt ${retryCount + 1}`);
        } else {
          throw new Error("Failed to fetch questions after multiple attempts.");
        }
      }
      const data = await response.json();
      setDifficulty(selectedDifficulty);
      setQuestions(data.results);
      setCurrentQuestionIndex(0); // Start from the first question
      setPlayerAnswers(Array(data.results.length).fill(null)); // Reset player's answers
    } catch (err) {
      setError(err.message || "Failed to fetch questions.");
      console.error(err);
    }
  };

  // Timer for 45 seconds countdown
  useEffect(() => {
    if (questions.length > 0 && !quizFinished) {
      const countdown = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(countdown); // Stop countdown at 0
            setQuizFinished(true);
            sendScoreToBackend();
          }
          return prevTime - 1;
        });
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [questions, quizFinished]);

  // Play audio 15 seconds after the round starts
  useEffect(() => {
    if (!audioPlayed && time <= 30 && questions.length > 0) {
      const audio = new Audio("countdown.mp377as7dfas"); // Replace with your audio file URL
      audioRef.current = audio;
      audio.play();
      setAudioPlayed(true);
    }
  }, [time, audioPlayed, questions]);

  // Stop audio when the quiz is finished
  useEffect(() => {
    if (quizFinished && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [quizFinished]);

  const handleAnswerClick = (answer) => {
    if (quizFinished) return;
  
    // Update player's answer for the current question
    setPlayerAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      newAnswers[currentQuestionIndex] = answer; // Store player's answer for the current question
      return newAnswers;
    });
  
    // Compare the player's answer with the correct answer
    const correctAnswer = decodeHTMLEntities(questions[currentQuestionIndex].correct_answer); // Decode HTML entities
  
    if (answer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()) {
      setCorrectCount((prev) => prev + 1); // Increment correct answers
    } else {
      setIncorrectCount((prev) => prev + 1); // Increment incorrect answers
    }
  
    // Move to the next question or finish the quiz
    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex); // Update to next question
    } else {
      // If it's the last question, ensure all state updates are applied before sending to backend
      setQuizFinished(true);
      sendScoreToBackend(); // Send the score to the backend
    }
  };
  

  if (error) {
    return <p>{error}</p>;
  }

  if (questions.length === 0) {
    return (
      <>
        <h1>Choose Difficulty</h1>
        <div style={{ display: "flex", justifyContent: "center", gap: "10px", margin: "20px 0" }}>
          <Button onClick={() => fetchQuestions(0, "easy")}>Easy</Button>
          <Button onClick={() => fetchQuestions(0, "medium")}>Medium</Button>
          <Button onClick={() => fetchQuestions(0, "hard")}>Hard</Button>
        </div>
      </>
    );
  }

  if (quizFinished || time === 0) {
    let finalScoreMultiplier = 1;
    if (difficulty === "medium") finalScoreMultiplier = 2;
    if (difficulty === "hard") finalScoreMultiplier = 3;

    const finalScore = correctCount * finalScoreMultiplier;

    return (
      <div>
        <h1>Quiz Finished!</h1>
        <p>Correct Answers: {correctCount}</p>
        <p>Incorrect Answers: {incorrectCount}</p>
        <p>Total Time Taken: {45 - time} seconds</p>
        <h1>Score: {finalScore}</h1>
        <Button onClick={() => navigate("/home")}>Play Again</Button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div>
      <h1>Quiz</h1>
      <h3>Question {currentQuestionIndex + 1} of {questions.length}:</h3>
      <h1 dangerouslySetInnerHTML={{ __html: currentQuestion.question }} />

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", maxWidth: "900px", margin: "20px auto" }}>
        {shuffledAnswers.map((answer, index) => (
          <Button key={index} onClick={() => handleAnswerClick(answer)} style={{ width: "48%", margin: "5px 0", padding: "10px", fontSize: "24px", cursor: "pointer" }}>
            <span dangerouslySetInnerHTML={{ __html: answer }} />
          </Button>
        ))}
      </div>

      <p>Time Remaining: {time} seconds</p>
    </div>
  );
};

export default Game;
