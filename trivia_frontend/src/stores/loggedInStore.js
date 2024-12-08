import { create } from "zustand";
import { persist } from "zustand/middleware";

const useLoggedInStore = create(
  persist(
    (set) => ({
      loggedInPlayers: [],

      setLoggedInPlayers: (players) => {
        console.log("Updating Zustand store with players:", players); 
        set({ loggedInPlayers: players });
      },

      addLoggedInPlayer: (player) =>
        set((state) => {
          const exists = state.loggedInPlayers.some(
            (p) => p.userId === player.userId
          );
          if (!exists) {
            return { loggedInPlayers: [...state.loggedInPlayers, player] };
          }
          return state; 
        }),

      removeLoggedInPlayer: (userId) =>
        set((state) => ({
          loggedInPlayers: state.loggedInPlayers.filter(
            (player) => player.userId !== userId
          ),
        })),
    }),
    {
      name: "logged-in-players",
    }
  )
);

export default useLoggedInStore;
