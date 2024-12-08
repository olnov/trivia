const onlineUsers = new Map();

const setupUserSocket = (io) => {
    const userNamespace = io.of("/user");

    userNamespace.on("connection", (socket) => {
        console.log("[Info user namespace] User connected:", socket.id);

        // Listen to the event, once received, generate event to update players online. Hate sockets :)
        socket.on("user-online", (userId) => {
            console.log(`User ${userId} is online`);
            onlineUsers.set(socket.id, userId);
            userNamespace.emit("updateUsersOnline", Array.from(onlineUsers.values()));
        });

        socket.on("disconnect", () => {
            console.log("[Info user namespace] User disconnected from namespace:", socket.id);
        });
    });

    return io; 
};

module.exports = setupUserSocket;
