import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../pages/Login";
import { login } from "../services/UserService"; // Import the login function
import { vi, describe, beforeEach, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

// Mock the login function from UserService
vi.mock("../services/UserService", () => ({
  login: vi.fn(),
}));

describe("Login Component", () => {
  beforeEach(() => {
    vi.resetAllMocks(); // Reset mocks before each test
    global.localStorage = {
      setItem: vi.fn(),
    };
  });

  it("redirects to home page on successful login", async () => {
    // Mock the login function to return a token and userId
    login.mockResolvedValueOnce({ token: "testToken", userId: "testUserId" });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Simulate user typing in the email and password
    await userEvent.type(
      screen.getByLabelText(/Email address/i),
      "james@gmail.com"
    );
    await userEvent.type(screen.getByLabelText(/Password/i), "password!1");

    // Simulate the form submission
    await fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    // Ensure that the login function was called with the correct arguments
    expect(login).toHaveBeenCalledWith("james@gmail.com", "password!1");

    // Wait for the localStorage to be updated
    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith("token", "testToken");
      expect(localStorage.setItem).toHaveBeenCalledWith("userId", "testUserId");
    });
  });
});
