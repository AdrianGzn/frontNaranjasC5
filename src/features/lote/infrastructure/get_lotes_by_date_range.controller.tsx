import { useState } from "react";
import { GetLotesByDateRange } from "../application/get_lotes_by_date_range.usecase";
import ILote from "../domain/lote.repository";
import APIRepositoryLote from "./apiLote.repository";
import { LoteDetailsResponse } from "../domain/LoteDetailsResponse";

export default function useGetLotesByDateRange() {
    const [lotesDetails, setLotesDetails] = useState<LoteDetailsResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const getLotesByDateRange = async (userId: number, startDate: string, endDate: string) => {
        setLoading(true);
        setError(null);

        try {
            const repository: ILote = new APIRepositoryLote();
            const getLotesByDateRangeUsecase = new GetLotesByDateRange(repository);
            const result = await getLotesByDateRangeUsecase.execute(userId, startDate, endDate);
            setLotesDetails(result);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return { lotesDetails, loading, error, getLotesByDateRange };
}