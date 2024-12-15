// This module implements realtime user presense and basic messaging functionality.

const onlineUsers = new Map();
const invitedUsers = new Map();

const setupUserSocket = (io) => {
    const userNamespace = io.of("/user");

    // Function to get users in a room. Used to get online users.
    const getUsersInRoom = (room) => {
        const users = userNamespace.adapter.rooms.get(room);
        if (users != null) {
            return Array.from(users)
                .map((socketId) => onlineUsers.get(socketId))
                .filter((user) => user !== undefined)
                .map((user) => user.userId);
        }
        return [];
    };

    // Function to generate a new room code
    const generateRoomCode = (hostId) => {
        return `INV-${hostId}`;
    };

    userNamespace.on("connection", (socket) => {
        console.log("[Info user namespace] User connected:", socket.id);

        // Listen to the event, once received, generate event to update players online.
        // TBD: Thins baout refactoring. Need to substitute updateUsersOnline with getUsersInRoom.
        // There is no need to store the online users in a state manager.
        socket.on("user-online", (userId) => {
            console.log(`User ${userId} is online`);
            socket.join('onlineUsers');
            console.log(`Socket id: ${socket.id} joined room onlineUsers`);
            // onlineUsers.set(socket.id, userId);
            onlineUsers.set(socket.id, { userId, socketId: socket.id });
            userNamespace.emit("updateUsersOnline", Array.from(onlineUsers.values()).map((user) => user.userId));
        });

        
        // Waiting room for ivited users
        socket.on("user-invited", (userIds, hostId) => {
            if (!Array.isArray(userIds)) {
                console.error("Invalid data: user-invited event expects an array of user ids");
                return;
            }
            const invitedRoom = generateRoomCode(hostId);
            console.log("[Online users]:", onlineUsers);
            console.log("[Invited users sockets]:", onlineUsers.get(userIds[0])?.socketId);
            console.log(`Users ${userIds.join(", ")} are invited to room ${invitedRoom}`);
            userIds.forEach((userId) => {
                const userSocketEntry = Array.from(onlineUsers.values()).find(user => user.userId === userId);
                if (userSocketEntry) {
                    const userSocket = userSocketEntry.socketId;
                    userNamespace.sockets.get(userSocket)?.join(invitedRoom);
                    console.log(`Socket id: ${userSocket} joined room ${invitedRoom}`);
                    invitedUsers.set(userSocket, { userId, socketId: userSocket });
                } else {
                  console.error(`User ${userId} is not online`);
                }
              });
            userNamespace.emit("updateUsersInvited", Array.from(invitedUsers.values()).map((user) => user.userId));
        });

        // Respond to client request for online users
        // TBD: Testing getting users in room as alternative to onlineUsers
        socket.on('get-online-users', () => {
            const roomUsers = getUsersInRoom('onlineUsers');
            console.log(`Users in onlineRoom: ${roomUsers}`);
            socket.emit('actual-user-list', roomUsers);
        });

        socket.on("user-offline", (userId) => {
            if (onlineUsers.has(socket.id)) {
                onlineUsers.delete(socket.id);
            }

            userNamespace.emit("updateUsersOnline", Array.from(onlineUsers.values()).map((user) => user.userId));
            console.log(`User ${userId} gone offline`);

            // TBD: Testing getting users in room as alternative to onlineUsers
            const roomUsers = getUsersInRoom('onlineUsers');
            socket.emit('actual-user-list', roomUsers);
        });

        socket.on("invitation", (message, hostId) => {
            const invitedRoom = generateRoomCode(hostId);
            console.log("Invitation recieved: ", message);
            const roomUsers = getUsersInRoom('onlineUsers');
            socket.emit('actual-user-list', roomUsers);
            Array.from(onlineUsers.keys()).forEach((userId) => {
                userNamespace.to(invitedRoom).emit("messaging", message);
                console.log(`Message sent to userId ${userId}:`, message);
            });
        });

        socket.on("disconnect", () => {
            console.log("[Info user namespace] User disconnected from namespace:", socket.id);

            if (onlineUsers.has(socket.id)) {
                onlineUsers.delete(socket.id);
            }

            userNamespace.emit("updateUsersOnline", Array.from(onlineUsers.values()).map((user) => user.userId));

            // TBD: Testing getting users in room as alternative to onlineUsers
            const roomUsers = getUsersInRoom('onlineUsers');
            socket.emit('actual-user-list', roomUsers);
        });
    });

    return io;
};

module.exports = setupUserSocket;
