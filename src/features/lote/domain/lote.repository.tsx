import Lote from "./lote.entity"

export default interface ILote {
    Create(lote: Lote): Promise<Lote>
    Update(id: number, caja: Lote): Promise<Lote>
    ConsultLote(id: number): Promise<Lote>
    ConsultLotes(): Promise<Lote[]>
    Delete(id: number): Promise<any>
}