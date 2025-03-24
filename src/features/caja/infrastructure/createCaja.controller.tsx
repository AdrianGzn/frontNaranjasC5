import { useEffect, useState } from "react";
import { CreateCaja } from "../application/create_caja.usecase";
import ICaja from "../domain/caja.repository";
import APIRepositoryCaja from "./apiCaja.repository";
import Caja from "../domain/caja.entity";

export default function useCreateCaja(cajaNueva: Caja) {
  const [caja, setCaja] = useState<Caja>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const repository: ICaja = new APIRepositoryCaja();
    const createCajaUsecase = new CreateCaja(repository);

    createCajaUsecase
      .execute(cajaNueva)
      .then(setCaja)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { caja, loading, error };
};