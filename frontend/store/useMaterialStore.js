import { create } from "zustand";
import { persist } from "zustand/middleware";

const useMaterialStore = create(
  persist(
    (set) => ({
      options: "mat",
      setOptions: (state) => set({ options: state }),
    }),
    { name: "materials" }
  )
);

export default useMaterialStore;
