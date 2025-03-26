import { useEffect, useState } from "react";
import { ConsultCajas } from "../application/consult_cajas.usecase";
import ICaja from "../domain/caja.repository";
import APIRepositoryCaja from "./apiCaja.repository";
import Caja from "../domain/caja.entity";

export default function useGetCajas() {
  const [cajasResult, setCajas] = useState<Caja[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const consultCajas = async () => {
        setLoading(true);
        setError(null);
    
        try {
          const repository: ICaja = new APIRepositoryCaja();
          const getCajasUseCase = new ConsultCajas(repository);
          const resultCajas = await getCajasUseCase.execute();
          setCajas(resultCajas);
        } catch (err) {
          setError((err as Error).message);
        } finally {
          setLoading(false);
        }
  };

  return { cajasResult, loading, error, consultCajas };
};