import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Nav from "../pages/Navbar";
import { describe, it, vi, expect, beforeEach } from "vitest";
import { ChakraProvider } from "@chakra-ui/react";

const mockNavigate = vi.fn(); // Create a mock function for navigate
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate, // Mock useNavigate to return mockNavigate
  };
});

describe("Nav Component", () => {
  const setup = () => {
    // Mock useNavigate to use our mock function

    return render(
      <ChakraProvider>
        <MemoryRouter>
          <Nav />
        </MemoryRouter>
      </ChakraProvider>
    );
  };

  beforeEach(() => {
    localStorage.clear(); // Clear localStorage before each test
    vi.clearAllMocks(); // Clear mock calls before each test
  });

  it("renders the logo and navigates to home on click", () => {
    setup();

    const logo = screen.getByRole("img", { name: /logo/i }); // Make sure your logo has an alt text
    expect(logo).toBeInTheDocument();

    fireEvent.click(logo);

    expect(mockNavigate).toHaveBeenCalledWith("/home");
  });

  it("toggles between light and dark mode", () => {
    setup();

    const toggleButton = screen.getByTestId("dark-mode", { name: /moon|sun/i });

    expect(toggleButton).toBeInTheDocument();

    // Simulate toggle to dark mode
    fireEvent.click(toggleButton);

    // You might want to verify the icon changes or other state changes
  });

  it("shows the user menu when avatar is clicked", () => {
    setup();

    // const avatarButton = screen.getByTestId("avatar", { name: /avatar/i });
    // fireEvent.click(avatarButton);

    const logoutOption = screen.getByTestId("Logout-button");
    expect(logoutOption).toBeInTheDocument();
  });

  it("logs out the user and navigates to login on 'Logout' click", () => {
    localStorage.setItem("userId", "12345"); // Set userId in localStorage
    setup();

    // const avatarButton = screen.getByTestId("avatar", { name: /avatar/i });
    // fireEvent.click(avatarButton);

    const logoutOption = screen.getByTestId("Logout-button");
    fireEvent.click(logoutOption);

    expect(localStorage.getItem("userId")).toBeNull(); // Confirm user is logged out
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
