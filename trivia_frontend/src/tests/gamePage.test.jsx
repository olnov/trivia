import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, beforeEach, it, expect, vi } from "vitest";
import Game from "../pages/Game"; // Adjust the path as necessary
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

// Mock the global fetch and localStorage
vi.stubGlobal("fetch", vi.fn());
vi.stubGlobal("localStorage", {
  setItem: vi.fn(),
  getItem: vi.fn(() => "testPlayerId"),
});

describe("Game Component", async () => {
  beforeEach(() => {
    vi.resetAllMocks(); // Reset mocks before each test
  });

  it("fetches questions and displays the first question after selecting a difficulty", async () => {
    // Mock the fetch call for questions
    fetch.mockResolvedValueOnce({
      json: async () => ({
        results: [
          {
            question: "What is the capital of France?",
            correct_answer: "Paris",
            incorrect_answers: ["London", "Berlin", "Madrid"],
          },
          {
            question: "What is 2 + 2?",
            correct_answer: "4",
            incorrect_answers: ["3", "5", "6"],
          },
        ],
      }),
    });

    render(
      <MemoryRouter>
        <Game />
      </MemoryRouter>
    );

    // Click on the "Easy" difficulty button
    await fireEvent.click(screen.getByText("Easy"));

    // Wait for the first question to be displayed
    await waitFor(() => {
      // Using getByRole to specifically target the heading or question container
      // expect(screen.getByTestId("question")).toHaveTextContent(
      //   "What is the capital of France?"
      // );
    });

    // Verify that answers are displayed
    expect(screen.getByText("Paris")).toBeInTheDocument();
    expect(screen.getByText("London")).toBeInTheDocument();
    expect(screen.getByText("Berlin")).toBeInTheDocument();
    expect(screen.getByText("Madrid")).toBeInTheDocument();
  });
});

it("records correct and incorrect answers, and finishes the quiz", async () => {
  // Mock the fetch call for questions
  fetch.mockResolvedValueOnce({
    json: async () => ({
      results: [
        {
          question: "What is the capital of France?",
          correct_answer: "Paris",
          incorrect_answers: ["London", "Berlin", "Madrid"],
        },
        {
          question: "What is 2 + 2?",
          correct_answer: "4",
          incorrect_answers: ["3", "5", "6"],
        },
      ],
    }),
  });

  render(
    <MemoryRouter>
      <Game />
    </MemoryRouter>
  );

  // Select difficulty
  await fireEvent.click(screen.getByText("Easy"));

  // Wait for the first question
  await waitFor(() => {
    // Use more specific targeting for the question
    // expect(screen.getByTestId("question")).toHaveTextContent(
    //   "What is the capital of France?"
    // );
  });

  // Answer the first question (correct)
  await fireEvent.click(screen.getByText("Paris"));

  // Move to the next question
  await waitFor(() => {
    expect(screen.getByTestId("question")).toHaveTextContent("What is 2 + 2?");
  });

  // Answer the second question (correct)
  await fireEvent.click(screen.getByText("4"));

  // Check that the quiz finishes after the second question
  await waitFor(() => {
    expect(screen.getByText("Quiz Finished!")).toBeInTheDocument();
    expect(screen.getByText("Correct Answers:")).toBeInTheDocument();
  });
});

it("submits the score to the backend after the quiz is finished", async () => {
  // Mock the fetch call for fetching questions
  fetch
    .mockResolvedValueOnce({
      json: async () => ({
        results: [
          {
            question: "What is the capital of France?",
            correct_answer: "Paris",
            incorrect_answers: ["London", "Berlin", "Madrid"],
          },
          {
            question: "What is 2 + 2?",
            correct_answer: "4",
            incorrect_answers: ["3", "5", "6"],
          },
        ],
      }),
    })
    // Mock the fetch call for score submission
    .mockResolvedValueOnce({ ok: true });
});
render(
  <MemoryRouter>
    <Game />
  </MemoryRouter>
);

// Select difficulty (e.g., Easy)
await fireEvent.click(screen.getByText("Easy"));

// Wait for the first question to appear
await waitFor(() => {
  // expect(screen.getByTestId("question")).toHaveTextContent(
  //   "What is the capital of France?"
  // );
});

// Answer the first question correctly
// await fireEvent.click(screen.getByText("Paris"));

// Answer the second question correctly
// await fireEvent.click(screen.getByText("4"));

// Ensure the quiz finishes
// await waitFor(() => {
//   expect(screen.getByText("Quiz Finished!")).toBeInTheDocument();
// });

// Validate that the second `fetch` call (score submission) is correct
// await waitFor(() => {
//   expect(fetch).toHaveBeenNthCalledWith(
//     "https://opentdb.com/api.php?amount=10&difficulty=easy&type=multiple"
//   );
// });

//   // Ensure that the mock call for score submission was successful
//   expect(fetch).toHaveBeenCalledTimes(2); // One for questions, one for score submission
// });
