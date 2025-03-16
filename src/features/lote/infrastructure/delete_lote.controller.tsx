import { useEffect, useState } from "react";
import { DeleteLote } from "../application/delete_lote.usecase";
import ILote from "../domain/lote.repository";
import APIRepositoryLote from "./apiLote.repository";
import ResponseDeleteLote from "../domain/response_delete_lote";

export default function useDeleteLote(id: number) {
  const [response, setResponse] = useState<ResponseDeleteLote>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const repository: ILote = new APIRepositoryLote();
    const deleteLoteUsecase = new DeleteLote(repository);

    deleteLoteUsecase
      .execute(id)
      .then(setResponse)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { response, loading, error };
};