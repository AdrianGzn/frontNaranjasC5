import { useState, useCallback } from "react";
import { getEsp32Id } from "../application/getEsp32IsUseCase";
import IEsp32 from "../domain/esp32.repository";
import APIRepositoryEsps from "./apiCaja.repository";
import Esp32 from "../domain/esp32.entity";

export default function useGetEspsId() {
  const [espsResult, setEspsResult] = useState<Esp32[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const consultEspsId = useCallback(async (id: number | undefined) => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const repository: IEsp32 = new APIRepositoryEsps();
      const getEspsUseCase = new getEsp32Id(repository);
      const resultEsps = await getEspsUseCase.run(id);
      setEspsResult(resultEsps);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  const consultEspsIdWaiting = useCallback(async (id: number | undefined) => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const repository: IEsp32 = new APIRepositoryEsps();
      const getEspsUseCase = new getEsp32Id(repository);
      const resultEsps = await getEspsUseCase.runWaiting(id);
      setEspsResult(resultEsps);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { espsResult, loading, error, consultEspsId, consultEspsIdWaiting };
}