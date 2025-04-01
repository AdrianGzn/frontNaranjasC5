import { create } from "zustand";
import Caja from "../features/caja/domain/caja.entity";

interface CajasState {
  cajasStore: Caja[];
  addCaja: (caja: Caja) => void;
  setCajas: (cajas: Caja[]) => void;
  clearCajas: () => void;
}

export const useCajasStore = create<CajasState>((set) => ({
  cajasStore: [],
  addCaja: (caja) => set((state) => ({ cajasStore: [...state.cajasStore, caja] })),
  setCajas: (cajasStore) => set({ cajasStore }),
  clearCajas: () => set({ cajasStore: [] }),
}));
