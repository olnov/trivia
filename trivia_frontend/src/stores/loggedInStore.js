import { create } from "zustand";
import { persist } from "zustand/middleware";

const useLoggedInStore = create(
  persist(
    (set) => ({
      loggedInPlayers: [],

      setLoggedInPlayers: (players) => set({ loggedInPlayers: players }),

      addLoggedInPlayer: (player) =>
        set((state) => ({
          loggedInPlayers: [...state.loggedInPlayers, player],
        })),

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
