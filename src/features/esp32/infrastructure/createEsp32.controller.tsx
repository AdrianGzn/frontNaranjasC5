import { useState } from "react";
import IEsp32 from "../domain/esp32.repository";
import APIRepositoryEsps from "./apiCaja.repository";
import Esp32 from "../domain/esp32.entity";
import { CreateEsps } from "../application/createEsp32.usecase";

export default function useCreateEsps() {
  const [espCreated, setEspsResult] = useState<Esp32>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const createEsps = async (esp: Esp32) => {
    setLoading(true);
    setError(null);
    
    try {
        const repository: IEsp32 = new APIRepositoryEsps();
        const createEspsUseCase = new CreateEsps(repository);
        const espResponse = await createEspsUseCase.execute(esp);
        setEspsResult(espResponse);
    } catch (err) {
        setError((err as Error).message);
    } finally {
        setLoading(false);
    }
  };

  return { espCreated, loading, error, createEsps };
};