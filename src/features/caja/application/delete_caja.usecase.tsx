import ICaja from "../domain/caja.repository";

export class DeleteCaja {
  private repository: ICaja;

  constructor(repository: ICaja) {
    this.repository = repository;
  }

  async execute(id: number): Promise<any> {
    return await this.repository.Delete(id);
  }
}
