import { render, screen, waitFor } from '@testing-library/react';
import Leaderboard from '../pages/Leaderboard';
import { vi, describe, beforeEach, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { useNavigate } from 'react-router-dom';

// Mock the fetch function
global.fetch = vi.fn();

// Mock useNavigate from react-router-dom
const mockNavigate = vi.fn(); // Create a mock function for navigate

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate, // Mock useNavigate to return mockNavigate
  };
});

describe('Leaderboard Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('navigates to home when Home button is clicked', async () => {
    // Mock successful fetch response
    const mockLeaderboardData = [
      { userId: '1', fullName: 'John Doe', totalScore: 100 },
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockLeaderboardData),
    });

    render(
      <MemoryRouter>
        <Leaderboard />
      </MemoryRouter>
    );

    // Wait for leaderboard data to be rendered
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Wait for the Home button to appear
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Home/i })).toBeInTheDocument();
    });

    // Simulate clicking the "Home" button
    await userEvent.click(screen.getByRole('button', { name: /Home/i }));

    // Ensure navigate was called with "/home"
    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });
});