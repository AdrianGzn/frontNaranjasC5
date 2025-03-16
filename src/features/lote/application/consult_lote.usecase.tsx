import ILote from "../domain/lote.repository";
import { Lote } from "../domain/lote.entity";

export class ConsultLote {
  private repository: ILote;

  constructor(repository: ILote) {
    this.repository = repository;
  }

  async execute(): Promise<Lote> {
    return await this.repository.ConsultLote();
  }
}
