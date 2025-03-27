import { useState } from "react";
import { GetEsps } from "../application/getEsp32.usecase";
import IEsp32 from "../domain/esp32.repository";
import APIRepositoryEsps from "./apiCaja.repository";
import Esp32 from "../domain/esp32.entity";

export default function useGetCajas() {
  const [cajasResult, setCajas] = useState<Esp32[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const consultCajas = async () => {
        setLoading(true);
        setError(null);
    
        try {
          const repository: IEsp32 = new APIRepositoryEsps();
          const getEspsUseCase = new GetEsps(repository);
          const resultEsps = await getEspsUseCase.execute();
          setCajas(resultEsps);
        } catch (err) {
          setError((err as Error).message);
        } finally {
          setLoading(false);
        }
  };

  return { cajasResult, loading, error, consultCajas };
};