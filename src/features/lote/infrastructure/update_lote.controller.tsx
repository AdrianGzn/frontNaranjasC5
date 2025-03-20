import { useEffect, useState } from "react";
import { UpdateLote } from "../application/update_lote.usecase";
import ILote from "../domain/lote.repository";
import APIRepositoryLote from "./apiLote.repository";
import { Lote } from "../domain/lote.entity";

export default function useUpdateLote(id: number, lote: Lote) {
  const [response, setResponse] = useState<Lote>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const repository: ILote = new APIRepositoryLote();
    const updateLoteUsecase = new UpdateLote(repository);

    updateLoteUsecase
      .execute(id, lote)
      .then(setResponse)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { response, loading, error };
};