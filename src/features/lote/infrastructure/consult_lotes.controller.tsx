import { useEffect, useState } from "react";
import { ConsultLotes } from "../application/consult_lotes.usecase";
import ILote from "../domain/lote.repository";
import APIRepositoryLote from "./apiLote.repository";
import Lote from "../domain/lote.entity";

export default function useGetLotes() {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const consultLotes = async () => {
  setLoading(true);
  setError(null);
        
  try {
    const repository: ILote = new APIRepositoryLote();
    const consultLotesUsecase = new ConsultLotes(repository);
    const lotesResult = await consultLotesUsecase.execute();
     console.log("lotes", lotesResult)
      setLotes(lotesResult);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { lotes, loading, error, consultLotes };
};