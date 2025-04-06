import { useState } from "react";
import Esp32 from "../domain/esp32.entity";

export default function useStopLoadingEsp32() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const stopLoading = async (esp32Id: string) => {
        setLoading(true);
        setError(null);

        try {
            // Usar el endpoint correcto para cambiar el estado de la ESP32
            const response = await fetch(`${import.meta.env.VITE_API_URL_API_STATUS}/esp32/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    "esp32_fk": esp32Id,
                    "content": "esperando"
                }),
            });
            
            if (!response.ok) throw new Error("Error al detener la carga de la ESP32");
            return await response.json();
        } catch (err) {
            setError((err as Error).message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, stopLoading };
}