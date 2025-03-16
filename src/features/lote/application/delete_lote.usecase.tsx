import ILote from "../domain/lote.repository";
import ResponseDeleteLote from "../domain/response_delete_lote";

export class DeleteLote {
  private repository: ILote;

  constructor(repository: ILote) {
    this.repository = repository;
  }

  async execute(id: number): Promise<ResponseDeleteLote> {
    return await this.repository.Delete(id);
  }
}
