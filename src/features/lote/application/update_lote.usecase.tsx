import ILote from "../domain/lote.repository";
import { Lote } from "../domain/lote.entity";
import ResponseUpdateLote from "../domain/response_update_lote";

export class UpdateLote {
  private repository: ILote;

  constructor(repository: ILote) {
    this.repository = repository;
  }

  async execute(id: number, lote: Lote): Promise<ResponseUpdateLote> {
    return await this.repository.Update(id, lote);
  }
}
