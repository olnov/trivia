import { Button, Text } from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Game = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [shuffledAnswers, setShuffledAnswers] = useState([]); // To store shuffled answers for the current question
  const [playerAnswers, setPlayerAnswers] = useState([]); // To store player's selected answers
  const [time, setTime] = useState(45);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [difficulty, setDifficulty] = useState("easy");
  const [audioPlayed, setAudioPlayed] = useState(false);

  const audioRef = useRef(null);

  useEffect(() => {
    if (questions.length > 0) {
      const currentQuestion = questions[currentQuestionIndex];
      setShuffledAnswers(
        shuffleAnswers(
          currentQuestion.correct_answer,
          currentQuestion.incorrect_answers
        )
      );
    }
  }, [currentQuestionIndex, questions]);

  const shuffleAnswers = (correctAnswer, incorrectAnswers) => {
    const allAnswers = [...incorrectAnswers, correctAnswer];
    return allAnswers.sort(() => Math.random() - 0.5);
  };

  const sendScoreToBackend = async () => {
    const timestamp = new Date().toISOString();

    const scoreData = questions.map((question, index) => {
      const playersAnswer = playerAnswers[index]; // Using playerAnswers to store the actual selected answers
      const correctAnswer = question.correct_answer;
      const isCorrect = playersAnswer === correctAnswer || false;

      let scoreMultiplier = 1;
      if (difficulty === "medium") scoreMultiplier = 2;
      else if (difficulty === "hard") scoreMultiplier = 3;

      const userScore = isCorrect ? scoreMultiplier : 0;

      return {
        player_id: localStorage.getItem("userId"),
        players_answer: playersAnswer,
        correct_answer: correctAnswer,
        is_correct: isCorrect,
        difficulty: difficulty,
        score: userScore,
        answered_at: timestamp,
      };
    });

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

  const fetchQuestions = async (selectedDifficulty) => {
    try {
      const response = await fetch(
        `https://opentdb.com/api.php?amount=10&difficulty=${selectedDifficulty}&type=multiple`
      );
      const data = await response.json();
      setDifficulty(selectedDifficulty);
      setQuestions(data.results);
      setShuffledAnswers(
        shuffleAnswers(
          data.results[0].correct_answer,
          data.results[0].incorrect_answers
        )
      );
      setPlayerAnswers(Array(data.results.length).fill(null)); // Initialize playerAnswers array
    } catch (err) {
      setError(err.message || "Failed to fetch questions.");
      console.error(err);
    }
  };

  // useEffect(() => {
  //   if (questions.length > 0 && !quizFinished) {
  //     const countdown = setInterval(() => {
  //       setTime((prevTime) => {
  //         if (prevTime <= 1) {
  //           clearInterval(countdown);
  //           setQuizFinished(true);
  //           sendScoreToBackend();
  //         }
  //         return prevTime - 1;
  //       });
  //     }, 1000);
  //     return () => clearInterval(countdown);
  //   }
  // }, [questions, quizFinished]);

  const handleAnswerClick = (answer) => {
    if (quizFinished) return; // Prevent further answers if quiz is finished

    // Store the player's answer for the current question
    setPlayerAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      newAnswers[currentQuestionIndex] = answer; // Update the answer for the current question
      return newAnswers;
    });

    const correctAnswer = questions[currentQuestionIndex].correct_answer;

    if (answer === correctAnswer) {
      setCorrectCount((prev) => prev + 1); // Increment correct answers
    } else {
      setIncorrectCount((prev) => prev + 1); // Increment incorrect answers
    }

    // Move to the next question or finish the quiz
    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex); // Move to the next question
    } else {
      setQuizFinished(true); // Mark the quiz as finished
    }
  };

  // Trigger sending the score to the backend after the quiz is finished
  useEffect(() => {
    if (quizFinished) {
      // Call the backend only after the quiz is finished
      sendScoreToBackend();
    }
  }, [quizFinished]); // This useEffect will trigger when quizFinished changes

  // Timer logic
  useEffect(() => {
    if (questions.length > 0 && !quizFinished) {
      const countdown = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(countdown);
            setQuizFinished(true); // Finish the quiz when the time runs out
          }
          return prevTime - 1;
        });
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [questions, quizFinished]);

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
            gap: "10px",
            margin: "20px 0",
          }}
        >
          <Button onClick={() => fetchQuestions("easy")}>Easy</Button>
          <Button onClick={() => fetchQuestions("medium")}>Medium</Button>
          <Button onClick={() => fetchQuestions("hard")}>Hard</Button>
        </div>
      </>
    );
  }

  if (quizFinished || time === 0) {
    let finalScoreMultiplier =
      difficulty === "medium" ? 2 : difficulty === "hard" ? 3 : 1;
    const finalScore = correctCount * finalScoreMultiplier;

    return (
      <div className="content-container quiz">
      <div className="content-container quiz">
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
    <div className="content-container quiz">
      <h1>Quiz</h1>
      <h3>
        Question {currentQuestionIndex + 1} of {questions.length}:
      </h3>
      {/* Display the question */}
      <Text
        fontSize={24}
        dangerouslySetInnerHTML={{ __html: currentQuestion.question }}
      />
      <Text
        fontSize={24}
        dangerouslySetInnerHTML={{ __html: currentQuestion.question }}
      />

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          maxWidth: "900px",
          margin: "20px auto",
        }}
      >
        {shuffledAnswers.map((answer, index) => (
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

      <p>Time Remaining: {time} seconds</p>
    </div>
  );
};

export default Game;
