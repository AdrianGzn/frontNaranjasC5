import { useState } from "react";
import APIRepositoryLote from "./apiLote.repository";
import Lote from "../domain/lote.entity";

export default function useGetLotesByEsp32() {
    const [lotes, setLotes] = useState<Lote[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const getLotesByEsp32 = async (esp32Id: string) => {
        setLoading(true);
        setError(null);

        try {
            const repository = new APIRepositoryLote();
            // Suponiendo que hay un endpoint para obtener lotes por ESP32.
            // Si no existe, deberías crear uno o usar el endpoint adecuado.
            const response = await fetch(`${import.meta.env.VITE_API_URL}/lotes/esp32/${esp32Id}`);
            
            if (!response.ok) throw new Error("Error al consultar lotes por ESP32");
            
            const data = await response.json();
            setLotes(data);
            return data;
        } catch (err) {
            setError((err as Error).message);
            return [];
        } finally {
            setLoading(false);
        }
    };

    return { lotes, loading, error, getLotesByEsp32 };
}