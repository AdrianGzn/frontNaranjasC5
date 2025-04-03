import ILote from "../domain/lote.repository";
import { LoteDetailsResponse } from "../domain/LoteDetailsResponse";

export class GetLoteDetails {
    private repository: ILote;

    constructor(repository: ILote) {
        this.repository = repository;
    }

    async execute(id: number): Promise<LoteDetailsResponse> {
        return await this.repository.GetLoteDetails(id);
    }
}