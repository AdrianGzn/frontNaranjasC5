import { useState } from "react";
import { UpdateCaja } from "../application/asign_caja.usecase";
import ICaja from "../domain/caja.repository";
import APIRepositoryCaja from "./apiCaja.repository";
import Caja from "../domain/caja.entity";

export default function useAsignCaja() {
  const [response, setResponse] = useState<Caja>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const asignCaja = async (id: number, cajaNueva: Caja) => {
        setLoading(true);
        setError(null);
    
        try {
          const repository: ICaja = new APIRepositoryCaja();
          const asignCajaUsecase = new UpdateCaja(repository);
          const loteEditado = await asignCajaUsecase.execute(id, cajaNueva);
          setResponse(loteEditado);
        } catch (err) {
          setError((err as Error).message);
        } finally {
          setLoading(false);
        }
  };

  return { response, loading, error, asignCaja };
};