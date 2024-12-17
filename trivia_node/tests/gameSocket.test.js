import { beforeEach, afterEach, describe, it, expect } from "vitest";
const { createServer } = require("node:http");
const ioClient = require("socket.io-client");
const setupSocket = require('../sockets/gameSocket'); // Update to match your project structure

// Helper function to wait for a specific event
const waitFor = (socket, event) => {
    return new Promise((resolve) => {
        socket.once(event, resolve);
    });
};

describe("Quizzard socket server", () => {
    let httpServer, port, io;

    // Setup the HTTP server and Socket.io server before each test
    beforeEach(async () => {
        httpServer = createServer();
        io = setupSocket(httpServer);

        await new Promise((resolve) => {
            httpServer.listen(() => {
                port = httpServer.address().port;
                resolve();
            });
        });
    });

    // Close the HTTP server and Socket.io server after each test
    afterEach(async () => {
        if (io) {
            await io.close();
        }
        if (httpServer) {
            await new Promise((resolve) => httpServer.close(resolve));
        }
    });

    describe("Game Room Creation", () => {
        it("Host should be able to create a Game Room. Other player should be able to connect.", async () => {
            // #### Connect host player
            const hostClient = ioClient(`http://localhost:${port}`, {
                reconnectionDelay: 0,
                forceNew: true,
                transports: ['websocket'],
            });

            // Wait for the host client to connect
            await waitFor(hostClient, 'connect');

            // #### Host creates a room
            hostClient.emit('createRoom', { playerName: 'TestHostPlayer', difficulty: 'easy' });

            // Wait for the 'roomCreated' event
            const roomCreated = await waitFor(hostClient, 'roomCreated');
            expect(roomCreated).toHaveProperty('roomCode');
            expect(typeof roomCreated.roomCode).toBe('string');

            const roomCode = roomCreated.roomCode;

            // #### Guest player connects
            const guestClient = ioClient(`http://localhost:${port}`, {
                transports: ['websocket'],
                forceNew: true,
            });

            // Wait for the guest client to connect
            await waitFor(guestClient, 'connect');

            // Guest player joins the room
            guestClient.emit('joinRoom', { playerName: 'TestGuestPlayer', roomCode });

            // Wait for the 'joinedRoom' event
            const joinedRoom = await waitFor(guestClient, 'joinedRoom');
            expect(joinedRoom).toHaveProperty('players');
            expect(joinedRoom.players.length).toBe(2); // Host + Guest
            expect(joinedRoom.players[1].name).toBe('TestGuestPlayer');
            expect(joinedRoom).toHaveProperty('roomCode', roomCode);

            // Cleanup: Disconnect clients
            hostClient.disconnect();
            guestClient.disconnect();
        }, 10000); // Optional: Increase timeout if needed
    });
});
