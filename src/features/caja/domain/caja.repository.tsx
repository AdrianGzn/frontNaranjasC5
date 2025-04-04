import Caja from "./caja.entity"

export default interface ICaja {
    Create(caja: Caja): Promise<Caja>
    Asign(id: number, caja: Caja): Promise<Caja>
    ConsultCaja(id: number): Promise<Caja>
    ConsultCajas(): Promise<Caja[]>
    Delete(id: number): any
    GetByLote(id: number): Promise<Caja[]>
}