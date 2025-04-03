import ILote from "../domain/lote.repository";
import Lote from "../domain/lote.entity";

export class ConsultLotes {
  private repository: ILote;

  constructor(repository: ILote) {
    this.repository = repository;
  }

  async execute(id : number): Promise<Lote[]> {
    return await this.repository.ConsultLotes(id);
  }
}
