// Code to manage the user namespace socket connection
// TBD: Remove isConnected. It's not being used.

import { create } from "zustand";
import { getNamespaceSocket, connectNamespaceSocket } from "../services/SocketService";

const useUserSocketStore = create((set, get) => ({
  userSocket: null, // User namespace connection store
  isConnected: false, // Connection state flag

  connectUserSocket: () => {
    let userSocket = getNamespaceSocket("/user");
    if (!userSocket || !userSocket.connected) {
      connectNamespaceSocket("/user");
      userSocket = getNamespaceSocket("/user");
      userSocket.on("connect", () => {
        console.log("Connected to /user namespace");
        set({ isConnected: true }); 
      });
      userSocket.on("disconnect", () => {
        console.log("Disconnected from /user namespace");
        set({ isConnected: false }); 
      });
    }
    set({ userSocket });
  },

  disconnectUserSocket: () => {
    const userSocket = get().userSocket;
    if (userSocket) {
      userSocket.disconnect();
      console.log("Disconnected from /user namespace");
      set({ userSocket: null, isConnected: false });
    }
  },
}));

export default useUserSocketStore;
