import ILote from "../domain/lote.repository";
import { LoteDetailsResponse } from "../domain/LoteDetailsResponse";

export class GetLotesDetailsByUserID {
    private repository: ILote;

    constructor(repository: ILote) {
        this.repository = repository;
    }

    async execute(userId: number): Promise<LoteDetailsResponse[]> {
        return await this.repository.GetLotesDetailsByUserID(userId);
    }
}