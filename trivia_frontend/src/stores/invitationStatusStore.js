import { create } from "zustand";

const useInvitationStatusStore = create((set) => ({
  invitationStatus: {},

  setInvitationStatus: (status, userId) => {
    set((state) => ({
      invitationStatus: {
        ...state.invitationStatus,
        [userId]: status,
      },
    }));
  },

  clearInvitationStatus: () => {
    set({ invitationStatus: {} });
  },
}));

export default useInvitationStatusStore;