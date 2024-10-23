import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Signup from '../pages/Signup';
import { signUp, login } from '../services/UserService'; // Import the mock services
import { vi, describe, beforeEach, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

// Mock the services
vi.mock('../services/UserService', () => ({
  signUp: vi.fn(),
  login: vi.fn(),
}));

describe('Signup Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    global.localStorage = {
      setItem: vi.fn(),
    };
  });

  it('submits the form and logs in the user on successful sign-up', async () => {
    signUp.mockResolvedValueOnce(); // Mock the signUp function
    login.mockResolvedValueOnce({ token: 'testToken', userId: 'testUserId' }); // Mock login to return a token

    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    // Simulate user inputs
    await userEvent.type(screen.getByLabelText(/Full name/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/Email/i), 'john@example.com');
    
    // Use the specific id or name to differentiate between password and confirm password fields
    await userEvent.type(screen.getByLabelText('Password'), 'Password123!');
    await userEvent.type(screen.getByLabelText('Confirm password'), 'Password123!');

    // Simulate form submission
    fireEvent.click(screen.getByRole('button', { name: /Signup/i }));

    // Wait for signUp to be called and verify interactions
    await waitFor(() => {
      expect(signUp).toHaveBeenCalledWith('John Doe', 'john@example.com', 'Password123!');
    });

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith('john@example.com', 'Password123!');
    });

    // Check if localStorage was set with token and userId
    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'testToken');
    expect(localStorage.setItem).toHaveBeenCalledWith('userId', 'testUserId');
  });
});
