import Esp32 from "./esp32.entity"

export default interface IEsp32 {
    Create(caja: Esp32): Promise<Esp32>
    Update(id: number, caja: Esp32): Promise<Esp32>
    GetEspId(id: number | undefined): Promise<Esp32[]>
    GetEsp(id: number): Promise<Esp32>
    GetEsps(): Promise<Esp32[]>
    Delete(id: string): any
    GetEspIdWaiting(id: number | undefined): Promise<Esp32[]>
    StopLoading(esp32Id: string): Promise<Esp32>
}