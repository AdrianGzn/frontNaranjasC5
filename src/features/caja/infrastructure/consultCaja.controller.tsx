import { useEffect, useState } from "react";
import { ConsultCaja } from "../application/consult_caja.usecase";
import ICaja from "../domain/caja.repository";
import APIRepositoryCaja from "./apiCaja.repository";
import Caja from "../domain/caja.entity";
import { ConsultCajas } from "../application/consult_cajas.usecase";

export default function useGetCaja() {
  const [caja, setCajas] = useState<Caja>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const consultCaja = async (id: number) => {
          setLoading(true);
          setError(null);
      
          try {
            const repository: ICaja = new APIRepositoryCaja();
            const getCajaUseCase = new ConsultCaja(repository);
            const resultCaja = await getCajaUseCase.execute(id);
            setCajas(resultCaja);
          } catch (err) {
            setError((err as Error).message);
          } finally {
            setLoading(false);
          }
    };

  return { caja, loading, error, consultCaja };
};