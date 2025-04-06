import ILote from "../domain/lote.repository";
import Lote from "../domain/lote.entity";

export class FinishLote {
    private repository: ILote;

    constructor(repository: ILote) {
        this.repository = repository;
    }

    async execute(loteId: number): Promise<Lote> {
        return await this.repository.FinishLote(loteId);
    }
}