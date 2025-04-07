import { useState } from "react";
import { CreateLote } from "../application/create_lote.usecase";
import ILote from "../domain/lote.repository";
import APIRepositoryLote from "./apiLote.repository";
import Lote from "../domain/lote.entity";
import { CreateLoteRequest } from "../domain/CreateLoteRequest";

export default function useCreateLote() {
  const [lote, setLote] = useState<Lote>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const createLote = async (loteRequest: CreateLoteRequest) => {
    setLoading(true);
    setError(null);

    try {
      const repository: ILote = new APIRepositoryLote();
      const createLoteUsecase = new CreateLote(repository);
      const response = await createLoteUsecase.execute(loteRequest);
      setLote(response.lote);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { lote, loading, error, createLote};
};