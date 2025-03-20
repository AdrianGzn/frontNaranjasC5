import { useEffect, useState } from "react";
import { CreateLote } from "../application/create_lote.usecase";
import ILote from "../domain/lote.repository";
import APIRepositoryLote from "./apiLote.repository";
import { Lote } from "../domain/lote.entity";

export default function useCreateLote(loteNuevo: Lote) {
  const [lote, setLote] = useState<Lote>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const repository: ILote = new APIRepositoryLote();
    const createLoteUsecase = new CreateLote(repository);

    createLoteUsecase
      .execute(loteNuevo)
      .then(setLote)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { lote, loading, error };
};