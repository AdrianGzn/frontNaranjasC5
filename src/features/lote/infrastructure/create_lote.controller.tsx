import { useState } from "react";
import { CreateLote } from "../application/create_lote.usecase";
import ILote from "../domain/lote.repository";
import APIRepositoryLote from "./apiLote.repository";
import Lote from "../domain/lote.entity";

export default function useCreateLote() {
  const [lote, setLote] = useState<Lote>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const createLote = async (loteNuevo: Lote) => {
    setLoading(true);
    setError(null);

    try {
      const repository: ILote = new APIRepositoryLote();
      const createLoteUsecase = new CreateLote(repository);
      const nuevoLote = await createLoteUsecase.execute(loteNuevo);
      setLote(nuevoLote);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { lote, loading, error, createLote };
};