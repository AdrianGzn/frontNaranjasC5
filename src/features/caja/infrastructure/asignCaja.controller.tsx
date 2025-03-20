import { useEffect, useState } from "react";
import { UpdateCaja } from "../application/asign_caja.usecase";
import ICaja from "../domain/caja.repository";
import APIRepositoryCaja from "./apiCaja.repository";
import Caja from "../domain/caja.entity";

export default function useGetCaja(id: number, body: Caja) {
  const [response, setResponse] = useState<Caja>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const repository: ICaja = new APIRepositoryCaja();
    const getCajaUseCase = new UpdateCaja(repository);

    getCajaUseCase
      .execute(id, body)
      .then(setResponse)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { response, loading, error };
};