import { useEffect, useState } from "react";
import { ConsultCaja } from "../application/consult_caja.usecase";
import ICaja from "../domain/caja.repository";
import APIRepositoryCaja from "./apiCaja.repository";
import Caja from "../domain/caja.entity";

export default function useGetCaja() {
  const [caja, setCajas] = useState<Caja>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const repository: ICaja = new APIRepositoryCaja();
    const getCajaUseCase = new ConsultCaja(repository);

    getCajaUseCase
      .execute()
      .then(setCajas)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { caja, loading, error };
};