// src/ui/controllers/useGetCajas.ts
import { useEffect, useState } from "react";
import { ConsultCajas } from "../application/consult_cajas.usecase";
import ICaja from "../domain/caja.repository";
import APIRepositoryCaja from "./apiCaja.repository";
import Caja from "../domain/caja.entity";

export default function useGetCajas() {
  const [cajas, setCajas] = useState<Caja[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const repository: ICaja = new APIRepositoryCaja();
    const getCajasUseCase = new ConsultCajas(repository);

    getCajasUseCase
      .execute()
      .then(setCajas)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { cajas, loading, error };
};