import { getUsers } from '../services/UserService';
import { vi, describe, beforeEach, it, expect } from 'vitest';

describe('getUsers', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return users when the response is 200', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve([{ id: 1, name: 'John Doe' }]),
      })
    );

    const users = await getUsers();
    expect(users).toEqual([{ id: 1, name: 'John Doe' }]);
  });

  it('should throw an error when response is not 200', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        status: 500,
      })
    );

    await expect(getUsers()).rejects.toThrow('Error: 500');
  });
});
