import { useEffect, useState } from "react";
import { DeleteLote } from "../application/delete_lote.usecase";
import ILote from "../domain/lote.repository";
import APIRepositoryLote from "./apiLote.repository";

export default function useDeleteLote() {
  const [response, setResponse] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const consultCaja = async (id: number) => {
      setLoading(true);
      setError(null);
            
      try {
        const repository: ILote = new APIRepositoryLote();
        const consultLotesUsecase = new DeleteLote(repository);
        const loteEliminado = await consultLotesUsecase.execute(id);
        setResponse(loteEliminado);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
  };

  return { response, loading, error, consultCaja };
};