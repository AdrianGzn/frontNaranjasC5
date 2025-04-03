import { useState } from "react";
import { GetLotesDetailsByUserID } from "../application/get_lotes_details_by_user_usecase";
import ILote from "../domain/lote.repository";
import APIRepositoryLote from "./apiLote.repository";
import { LoteDetailsResponse } from "../domain/LoteDetailsResponse";

export default function useGetLotesDetailsByUserID() {
    const [lotesDetails, setLotesDetails] = useState<LoteDetailsResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const getLotesDetailsByUserID = async (userId: number) => {
        setLoading(true);
        setError(null);

        try {
            const repository: ILote = new APIRepositoryLote();
            const getLotesDetailsUsecase = new GetLotesDetailsByUserID(repository);
            const result = await getLotesDetailsUsecase.execute(userId);
            setLotesDetails(result);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return { lotesDetails, loading, error, getLotesDetailsByUserID };
}