import { Lote } from "./lote.entity"
import ResponseDeleteLote from "./response_delete_lote"
import ResponseUpdateLote from "./response_update_lote"

export default interface ILote {
    Create(): Promise<Lote>
    Update(id: number, caja: Lote): Promise<ResponseUpdateLote>
    ConsultLote(): Promise<Lote>
    ConsultLotes(): Promise<Lote[]>
    Delete(id: number): Promise<ResponseDeleteLote>
}