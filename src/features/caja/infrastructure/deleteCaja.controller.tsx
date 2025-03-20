import { useEffect, useState } from "react";
import { DeleteCaja } from "../application/delete_caja.usecase";
import ICaja from "../domain/caja.repository";
import APIRepositoryCaja from "./apiCaja.repository";

export default function useGetCaja(id: number) {
  const [response, setResponse] = useState();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const repository: ICaja = new APIRepositoryCaja();
    const getCajaUseCase = new DeleteCaja(repository);

    getCajaUseCase
      .execute(id)
      .then(setResponse)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { response, loading, error };
};