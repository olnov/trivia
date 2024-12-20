// #### Use this state to store a list of invited playes

import { create } from 'zustand';

const usePlayerStore = create((set)=> ({
    selectedPlayers: [],
    maxPlayers: 3,
    addPlayer: (player)=>
        set((state)=> {
            if (state.selectedPlayers.length >= state.maxPlayers) {
                return state;
            }
            return {
                selectedPlayers: [...state.selectedPlayers, player],
            };
        }),

        removePlayer: (id)=>
            set((state)=> ({
                selectedPlayers: state.selectedPlayers.filter((player)=> player.id != id),
            })),
        
        clearPlayers: () =>
            set((state) => ({
                selectedPlayers: [],
            })),
}))

export default usePlayerStore;