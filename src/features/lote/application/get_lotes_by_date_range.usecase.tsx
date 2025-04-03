import ILote from "../domain/lote.repository";
import { LoteDetailsResponse } from "../domain/LoteDetailsResponse";

export class GetLotesByDateRange {
    private repository: ILote;

    constructor(repository: ILote) {
        this.repository = repository;
    }

    async execute(userId: number, startDate: string, endDate: string): Promise<LoteDetailsResponse[]> {
        return await this.repository.GetLotesDetailsByDateRange(userId, startDate, endDate);
    }
}