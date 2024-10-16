import { Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
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

  // Function to shuffle answers (correct and incorrect)
  const shuffleAnswers = (correctAnswer, incorrectAnswers) => {
    const allAnswers = [...incorrectAnswers, correctAnswer];
    return allAnswers.sort(() => Math.random() - 0.5);
  };

  const fetchQuestions = async (retryCount = 0) => {
    try {
      const response = await fetch(
        "https://opentdb.com/api.php?amount=10&type=multiple"
      );
      if (!response.ok) {
        if (retryCount < 3) {
          console.log(`Retrying fetch: Attempt ${retryCount + 1}`);
          //   return fetchQuestions(retryCount + 1); // Retry fetching questions
        } else {
          throw new Error("Failed to fetch questions after multiple attempts.");
        }
      }
      const data = await response.json();
      console.log({ data });
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

  // Handle answer click and move to the next question
  const handleAnswerClick = (answer) => {
    if (quizFinished) return; // Prevent further answers after quiz finishes

    const correctAnswer = questions[currentQuestionIndex].correct_answer;

    if (answer === correctAnswer) {
      setCorrectCount((prev) => prev + 1);
    } else {
      setIncorrectCount((prev) => prev + 1);
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
    // return <p>Loading questions...</p>;
    return <Button onClick={fetchQuestions}>Load questions</Button>;
  }

  if (quizFinished || time === 0) {
    return (
      <div>
        <h1>Quiz Finished!</h1>
        <p>Correct Answers: {correctCount}</p>
        <p>Incorrect Answers: {incorrectCount}</p>
        <p>Total Time Taken: {45 - time} seconds</p>
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
              width: "48%", // 48% width for 2 buttons per row
              margin: "5px 0",
              padding: "10px",
              fontSize: "24px",
              cursor: "pointer",
            }}
          >
            {answer}
          </Button>
        ))}
      </div>

      {/* Display the countdown timer */}
      <p>Time Remaining: {time} seconds</p>
    </div>
  );
};

export default Game;
