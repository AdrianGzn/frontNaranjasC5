import Esp32 from "../domain/esp32.entity";
import IEsp32 from "../domain/esp32.repository";


export class getEsp32Id {
    private esp32Repository: IEsp32

    constructor(esp32Repository: IEsp32) {
        this.esp32Repository = esp32Repository
    }

    async run(id: number | undefined): Promise<Esp32[]> {
        return await this.esp32Repository.GetEspId(id)
    }

    async runWaiting(id: number | undefined): Promise<Esp32[]> {
        return await this.esp32Repository.GetEspIdWaiting(id)
    }
}