import IEsp32 from "../domain/esp32.repository";
import Esp32 from "../domain/esp32.entity";

export class DeleteEsps {
  private repository: IEsp32;

  constructor(repository: IEsp32) {
    this.repository = repository;
  }

  async execute(id: string): Promise<Esp32> {
    return await this.repository.Delete(id);
  }
}
