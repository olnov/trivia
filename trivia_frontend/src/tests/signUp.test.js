import { signUp } from '../services/UserService';
import { vi, describe, beforeEach, it, expect } from 'vitest';

describe('signUp', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return success message when user is registered successfully', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        status: 201,
      })
    );

    const message = await signUp('John Doe', 'test@example.com', 'password123');
    expect(message).toBe('User successfully registered');
  });

  it('should throw an error when registration fails', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        status: 400,
      })
    );

    await expect(signUp('John Doe', 'test@example.com', 'password123')).rejects.toThrow(
      'Error registering new user: 400'
    );
  });
});
