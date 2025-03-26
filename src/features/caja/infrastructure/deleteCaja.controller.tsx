import { useEffect, useState } from "react";
import { DeleteCaja } from "../application/delete_caja.usecase";
import ICaja from "../domain/caja.repository";
import APIRepositoryCaja from "./apiCaja.repository";

export default function useDeleteCaja() {
  const [response, setResponse] = useState();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const createCaja = async (id: number) => {
        setLoading(true);
        setError(null);
    
        try {
          const repository: ICaja = new APIRepositoryCaja();
          const deleteCajaUsecase = new DeleteCaja(repository);
          const cajaEliminada = await deleteCajaUsecase.execute(id);
          setResponse(cajaEliminada);
        } catch (err) {
          setError((err as Error).message);
        } finally {
          setLoading(false);
        }
  };

  return { response, loading, error, createCaja };
};