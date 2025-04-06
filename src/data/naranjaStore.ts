import { create } from "zustand";
import { Naranja } from "../shared/models/Naranja";

interface NaranjaState {
  naranjasStore: Naranja[];
  addNaranja: (naranja: Naranja) => void;
  setNaranjas: (naranjas: Naranja[]) => void;
  clearNaranjas: () => void;
}

export const useNaranjasStore = create<NaranjaState>((set) => ({
  naranjasStore: [],
  addNaranja: (naranja) =>
    set((state) => ({
      naranjasStore: [...state.naranjasStore, naranja]
    })),
  setNaranjas: (naranjasStore) => set({ naranjasStore }),
  clearNaranjas: () => set({ naranjasStore: [] }),
}));
