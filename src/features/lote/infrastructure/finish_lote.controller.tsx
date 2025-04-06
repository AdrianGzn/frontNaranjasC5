import { useState } from "react";
import Lote from "../domain/lote.entity";

export default function useFinishLote() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const finishLote = async (loteId: number) => {
        setLoading(true);
        setError(null);

        try {
            // Usar el endpoint correcto para finalizar un lote
            const response = await fetch(`${import.meta.env.VITE_API_URL}/lotes/${loteId}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    "estado": "terminado"
                }),
            });
            
            if (!response.ok) throw new Error("Error al finalizar el lote");
            return await response.json();
        } catch (err) {
            setError((err as Error).message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, finishLote };
}