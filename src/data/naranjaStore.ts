import { create } from "zustand";
import { Naranja } from "../presentation/pages/Home";

interface NaranjaState {
  naranjasStore: Naranja[];
  addNaranja: (caja: Naranja) => void;
  setNaranjas: (cajas: Naranja[]) => void;
  clearNaranjas: () => void;
}

export const useNaranjasStore = create<NaranjaState>((set) => ({
  naranjasStore: [],
  addNaranja: (Naranja) => set((state) => ({ naranjasStore: [...state.naranjasStore, Naranja] })),
  setNaranjas: (naranjasStore) => set({ naranjasStore }),
  clearNaranjas: () => set({ naranjasStore: [] }),
}));
