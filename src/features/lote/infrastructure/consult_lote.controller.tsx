import { useState } from "react";
import { ConsultLote } from "../application/consult_lote.usecase";
import ILote from "../domain/lote.repository";
import APIRepositoryLote from "./apiLote.repository";
import Lote from "../domain/lote.entity";

export default function useGetLote() {
  const [lote, setLote] = useState<Lote>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const consultCaja = async (id: number) => {
    setLoading(true);
    setError(null);
      
    try {
      const repository: ILote = new APIRepositoryLote();
      const consultLoteUsecase = new ConsultLote(repository);
      const loteResult = await consultLoteUsecase.execute(id);
      setLote(loteResult);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { lote, loading, error, consultCaja };
};