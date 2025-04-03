import { useEffect, useState } from "react";
import { CreateCaja } from "../application/create_caja.usecase";
import ICaja from "../domain/caja.repository";
import APIRepositoryCaja from "./apiCaja.repository";
import Caja from "../domain/caja.entity";

export default function useCreateCaja() {
  const [caja, setCaja] = useState<Caja>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const createCaja = async (cajaNueva: Caja) => {
      setLoading(true);
      setError(null);
  
      try {
        const repository: ICaja = new APIRepositoryCaja();
        const createCajaUsecase = new CreateCaja(repository);
        const nuevaCaja = await createCajaUsecase.execute(cajaNueva);
        setCaja(nuevaCaja);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
  };

  return { caja, loading, error, createCaja };
};