import ICaja from "../domain/caja.repository";
import Caja from "../domain/caja.entity";

export class CreateCaja {
  private repository: ICaja;

  constructor(repository: ICaja) {
    this.repository = repository;
  }

  async execute(caja: Caja): Promise<Caja> {
    return await this.repository.Create(caja);
  }
}
