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

        socket.on("user-offline", (userId)=> {
            if (onlineUsers.has(socket.id)) {
                onlineUsers.delete(socket.id);
            }

            userNamespace.emit("updateUsersOnline", Array.from(onlineUsers.values()));
            console.log(`User ${userId} gone offline`);
        });

        socket.on("invitation", (message)=> {
            console.log("Invitation recieved: ", message);
            console.log("Online users: ", Array.from(onlineUsers.values()));
            console.log("Connected sockets:", Array.from(io.sockets.sockets.keys()));
            console.log("Online users:", Array.from(onlineUsers.values()));
            console.log("Online users keys:", Array.from(onlineUsers.keys()));
            Array.from(onlineUsers.keys()).forEach((userId) => {
                userNamespace.to(userId).emit("messaging", message);
                console.log(`Message sent to userId ${userId}:`, message);
            });
            // userNamespace.emit("messaging", message);
        });

        socket.on("disconnect", () => {
            console.log("[Info user namespace] User disconnected from namespace:", socket.id);

            if (onlineUsers.has(socket.id)) {
                onlineUsers.delete(socket.id);
            }

            userNamespace.emit("updateUsersOnline", Array.from(onlineUsers.values()));
        });
    });

    return io; 
};

module.exports = setupUserSocket;
