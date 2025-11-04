import { create } from "zustand";

export const useUserData = create((set) => ({
  users: [],
  totalUsers: 0,

  setUsers: (users) => {
    set({ users });
  },
  setTotalUsers: (t) => {
    set({ totalUsers: t });
  },
  addUser: (user) =>
    set((state) => ({
      users: [...state.users, user],
    })),
  clearUser: () => set({ users: [] }),
}));
