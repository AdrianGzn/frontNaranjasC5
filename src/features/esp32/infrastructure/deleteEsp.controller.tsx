import { useState } from "react";
import IEsp32 from "../domain/esp32.repository";
import APIRepositoryEsps from "./apiCaja.repository";
import Esp32 from "../domain/esp32.entity";
import { DeleteEsps } from "../application/deleteEsp32.usecase";

export default function useDeleteEsps() {
  const [responseDeleted, setResponseDeleted] = useState<Esp32>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const deleteEsps = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
        const repository: IEsp32 = new APIRepositoryEsps();
        const deleteEspUseCase = new DeleteEsps(repository);
        const espResponse = await deleteEspUseCase.execute(id);
        setResponseDeleted(espResponse);
    } catch (err) {
        setError((err as Error).message);
    } finally {
        setLoading(false);
    }
  };

  return { responseDeleted, loading, error, deleteEsps };
};