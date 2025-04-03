import Lote from "./lote.entity"
import { CreateLoteRequest } from "./CreateLoteRequest"
import { CreatedLoteResponse } from "./CreatedLoteResponse"

export default interface ILote {
    Create(lote: CreateLoteRequest): Promise<CreatedLoteResponse> 
    Update(id: number, caja: Lote): Promise<Lote>
    ConsultLote(id: number): Promise<Lote>
    ConsultLotes(id: number): Promise<Lote[]>
    Delete(id: number): Promise<any>
}