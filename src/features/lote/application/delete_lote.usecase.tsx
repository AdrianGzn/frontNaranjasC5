import ILote from "../domain/lote.repository";

export class DeleteLote {
  private repository: ILote;

  constructor(repository: ILote) {
    this.repository = repository;
  }

  async execute(id: number): Promise<any> {
    return await this.repository.Delete(id);
  }
}
