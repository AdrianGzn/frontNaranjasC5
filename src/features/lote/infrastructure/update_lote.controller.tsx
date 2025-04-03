import { useEffect, useState } from "react";
import { UpdateLote } from "../application/update_lote.usecase";
import ILote from "../domain/lote.repository";
import APIRepositoryLote from "./apiLote.repository";
import Lote from "../domain/lote.entity";

export default function useUpdateLote() {
  const [response, setResponse] = useState<Lote>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

    const updateCaja = async (id: number, lote: Lote) => {
        setLoading(true);
        setError(null);
              
        try {
          const repository: ILote = new APIRepositoryLote();
          const consultLotesUsecase = new UpdateLote(repository);
          const loteEditado = await consultLotesUsecase.execute(id, lote);
          setResponse(loteEditado);
        } catch (err) {
          setError((err as Error).message);
        } finally {
          setLoading(false);
        }
    };

  return { response, loading, error, updateCaja };
};