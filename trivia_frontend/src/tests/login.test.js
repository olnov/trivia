import { json } from 'react-router-dom';
import { login } from '../services/UserService';
import { vi, describe, beforeEach, it, expect } from 'vitest';

describe('login', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('Should return 200 and JWT if the correct credentials are provided', async () => {
        global.fetch = vi.fn(() =>
            Promise.resolve({
                status: 200,
                json: () => Promise.resolve({ token: 'mockToken', userId: 'mockUserId' }),
            })
        );

        const data = await login('james@gmail.com','password!1');
        expect(data).toEqual({token:'mockToken', userId:'mockUserId'});
    })

    it('Should throw an error if authentication fails', async ()=>{
        global.fetch = vi.fn(() =>
            Promise.resolve({
                status: 401,
            })
        );

        await expect(login('wrong@email.com','wrognPassword')).rejects.toThrow('Authentication failed: 401');
    });
});