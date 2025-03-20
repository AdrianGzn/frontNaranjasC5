import ICaja from "../domain/caja.repository";
import Caja from "../domain/caja.entity";

export class UpdateCaja {
  private repository: ICaja;

  constructor(repository: ICaja) {
    this.repository = repository;
  }

  async execute(id: number, lote: Caja): Promise<Caja> {
    return await this.repository.Asign(id, lote);
  }
}
