import { useState } from "react";
import { GetLoteDetails } from "../application/get_lote_details.usecase";
import ILote from "../domain/lote.repository";
import APIRepositoryLote from "./apiLote.repository";
import { LoteDetailsResponse } from "../domain/LoteDetailsResponse";

export default function useGetLoteDetails() {
    const [loteDetails, setLoteDetails] = useState<LoteDetailsResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const getLoteDetails = async (id: number) => {
        setLoading(true);
        setError(null);

        try {
            const repository: ILote = new APIRepositoryLote();
            const getLoteDetailsUsecase = new GetLoteDetails(repository);
            const result = await getLoteDetailsUsecase.execute(id);
            setLoteDetails(result);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return { loteDetails, loading, error, getLoteDetails };
}