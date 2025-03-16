import { useEffect, useState } from "react";
import { ConsultLotes } from "../application/consult_lotes.usecase";
import ILote from "../domain/lote.repository";
import APIRepositoryLote from "./apiLote.repository";
import { Lote } from "../domain/lote.entity";

export default function useGetLotes() {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const repository: ILote = new APIRepositoryLote();
    const consultLotesUsecase = new ConsultLotes(repository);

    consultLotesUsecase
      .execute()
      .then(setLotes)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { lotes, loading, error };
};