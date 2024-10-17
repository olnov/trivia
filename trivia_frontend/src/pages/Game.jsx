import { Button } from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Game = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [time, setTime] = useState(45); // Countdown timer (45 seconds)
  const [correctCount, setCorrectCount] = useState(0); // Track correct answers
  const [incorrectCount, setIncorrectCount] = useState(0); // Track incorrect answers
  const [quizFinished, setQuizFinished] = useState(false); // Track if the quiz has finished
  const [difficulty, setDifficulty] = useState("easy"); // Track difficulty
  const [audioPlayed, setAudioPlayed] = useState(false); // Track if audio has played

  // Create a ref to store the audio element so it can be controlled
  const audioRef = useRef(null);

  // Function to shuffle answers (correct and incorrect)
  const shuffleAnswers = (correctAnswer, incorrectAnswers) => {
    const allAnswers = [...incorrectAnswers, correctAnswer];
    return allAnswers.sort(() => Math.random() - 0.5);
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
      setDifficulty(selectedDifficulty); // Set the difficulty for final score calculation
      setQuestions(data.results);
      setAnswers(
        shuffleAnswers(
          data.results[0].correct_answer,
          data.results[0].incorrect_answers
        )
      );
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
            clearInterval(countdown); // Stop the countdown at 0
            setQuizFinished(true); // End the quiz when time is up
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(countdown); // Clean up on unmount
    }
  }, [questions, quizFinished]);

  // Play audio 15 seconds after the round starts
  useEffect(() => {
    if (!audioPlayed && time <= 30 && questions.length > 0) {
      const audio = new Audio("countdown.mp3"); // Replace with your audio file URL or local file path
      audioRef.current = audio; // Store the audio element in the ref
      audio.play();
      setAudioPlayed(true); // Ensure it plays only once
    }
  }, [time, audioPlayed, questions]);

  // Stop audio when the quiz is finished
  useEffect(() => {
    if (quizFinished && audioRef.current) {
      audioRef.current.pause(); // Pause the audio
      audioRef.current.currentTime = 0; // Reset audio to the beginning
    }
  }, [quizFinished]);

  // Handle answer click and move to the next question
  const handleAnswerClick = (answer) => {
    if (quizFinished) return; // Prevent further answers after quiz finishes

    const correctAnswer = questions[currentQuestionIndex].correct_answer;

    if (answer === correctAnswer) {
      setCorrectCount((prev) => prev + 1); // Increment correct answers
    } else {
      setIncorrectCount((prev) => prev + 1); // Increment incorrect answers
    }

    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
      setAnswers(
        shuffleAnswers(
          questions[nextQuestionIndex].correct_answer,
          questions[nextQuestionIndex].incorrect_answers
        )
      );
    } else {
      setQuizFinished(true); // End the quiz if all questions are answered
    }
  };

  if (error) {
    return <p>{error}</p>;
  }

  if (questions.length === 0) {
    return (
      <>
        <h1>Choose Difficulty</h1>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px", // Space between buttons
            margin: "20px 0", // Space between header and buttons
          }}
        >
          <Button onClick={() => fetchQuestions(0, "easy")}>Easy</Button>
          <Button onClick={() => fetchQuestions(0, "medium")}>Medium</Button>
          <Button onClick={() => fetchQuestions(0, "hard")}>Hard</Button>
        </div>
      </>
    );
  }

  if (quizFinished || time === 0) {
    // Calculate the final score based on the difficulty and correct answers
    let finalScoreMultiplier = 1; // Default for easy
    if (difficulty === "medium") {
      finalScoreMultiplier = 2; // Double points for medium
    } else if (difficulty === "hard") {
      finalScoreMultiplier = 3; // Triple points for hard
    }

    const finalScore = correctCount * finalScoreMultiplier; // Multiply correct answers by the difficulty multiplier

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
      <h3>
        Question {currentQuestionIndex + 1} of {questions.length}:
      </h3>
      {/* Display the question */}
      <h1 dangerouslySetInnerHTML={{ __html: currentQuestion.question }} />

      {/* Display the shuffled answers in two rows (2 buttons per row) */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          maxWidth: "900px",
          margin: "20px auto",
        }}
      >
        {answers.map((answer, index) => (
          <Button
            key={index}
            onClick={() => handleAnswerClick(answer)}
            style={{
              width: "48%",
              margin: "5px 0",
              padding: "10px",
              fontSize: "24px",
              cursor: "pointer",
            }}
          >
            <span dangerouslySetInnerHTML={{ __html: answer }} />
          </Button>
        ))}
      </div>

      {/* Display the countdown timer */}
      <p>Time Remaining: {time} seconds</p>
    </div>
  );
};

export default Game;
