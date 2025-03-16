import { useEffect, useState } from "react";
import { ConsultLote } from "../application/consult_lote.usecase";
import ILote from "../domain/lote.repository";
import APIRepositoryLote from "./apiLote.repository";
import { Lote } from "../domain/lote.entity";

export default function useGetLote() {
  const [lotes, setLote] = useState<Lote>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const repository: ILote = new APIRepositoryLote();
    const consultLoteUsecase = new ConsultLote(repository);

    consultLoteUsecase
      .execute()
      .then(setLote)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { lotes, loading, error };
};