import ICaja from "../domain/caja.repository";
import Caja from "../domain/caja.entity";

export class ConsultCaja {
  private repository: ICaja;

  constructor(repository: ICaja) {
    this.repository = repository;
  }

  async execute(): Promise<Caja> {
    return await this.repository.ConsultCaja();
  }
}
