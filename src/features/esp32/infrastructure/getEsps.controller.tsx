import { useState } from "react";
import { GetEsps } from "../application/getEsp32.usecase";
import IEsp32 from "../domain/esp32.repository";
import APIRepositoryEsps from "./apiCaja.repository";
import Esp32 from "../domain/esp32.entity";

export default function useGetEsps() {
  const [espsResult, setEspsResult] = useState<Esp32[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const consultEsps = async () => {
        setLoading(true);
        setError(null);
    
        try {
          const repository: IEsp32 = new APIRepositoryEsps();
          const getEspsUseCase = new GetEsps(repository);
          const resultEsps = await getEspsUseCase.execute();
          setEspsResult(resultEsps);
        } catch (err) {
          setError((err as Error).message);
        } finally {
          setLoading(false);
        }
  };

  return { espsResult, loading, error, consultEsps };
};