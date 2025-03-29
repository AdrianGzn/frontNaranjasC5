import { useState } from "react";
import ICaja from "../domain/caja.repository";
import APIRepositoryCaja from "./apiCaja.repository";
import Caja from "../domain/caja.entity";
import { GetByLoteCajas } from "../application/getByLote_caja.usecase";

export default function useGetByLoteCajas() {
  const [cajasResult, setCajas] = useState<Caja[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const consultCajas = async (id: number) => {
        setLoading(true);
        setError(null);
    
        try {
          const repository: ICaja = new APIRepositoryCaja();
          const getCajasUseCase = new GetByLoteCajas(repository);
          const resultCajas = await getCajasUseCase.execute(id);
          setCajas(resultCajas);
        } catch (err) {
          setError((err as Error).message);
        } finally {
          setLoading(false);
        }
  };

  return { cajasResult, loading, error, consultCajas };
};