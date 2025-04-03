import ICaja from "../domain/caja.repository";
import Caja from "../domain/caja.entity";

export class GetByLoteCajas {
  private repository: ICaja;

  constructor(repository: ICaja) {
    this.repository = repository;
  }

  async execute(id: number): Promise<Caja[]> {
    return await this.repository.GetByLote(id);
  }
}
