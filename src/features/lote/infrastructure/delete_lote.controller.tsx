import { useEffect, useState } from "react";
import { DeleteLote } from "../application/delete_lote.usecase";
import ILote from "../domain/lote.repository";
import APIRepositoryLote from "./apiLote.repository";

export default function useDeleteLote(id: number) {
  const [response, setResponse] = useState<any>();
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