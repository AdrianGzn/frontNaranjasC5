import ILote from "../domain/lote.repository";
import Lote  from "../domain/lote.entity";

export class UpdateLote {
  private repository: ILote;

  constructor(repository: ILote) {
    this.repository = repository;
  }

  async execute(id: number, lote: Lote): Promise<Lote> {
    return await this.repository.Update(id, lote);
  }
}
