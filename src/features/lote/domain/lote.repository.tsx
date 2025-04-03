import Lote from "./lote.entity"
import { CreateLoteRequest } from "./CreateLoteRequest"
import { CreatedLoteResponse } from "./CreatedLoteResponse"
import { LoteDetailsResponse } from "./LoteDetailsResponse";

export default interface ILote {
    Create(lote: CreateLoteRequest): Promise<CreatedLoteResponse>
    Update(id: number, caja: Lote): Promise<Lote>
    ConsultLote(id: number): Promise<Lote>
    ConsultLotes(id: number): Promise<Lote[]>
    Delete(id: number): Promise<any>
    GetLoteDetails(id: number): Promise<LoteDetailsResponse>;
    GetLotesDetailsByUserID(id: number): Promise<LoteDetailsResponse[]>;
    GetLotesDetailsByDateRange(userId: number, startDate: string, endDate: string): Promise<LoteDetailsResponse[]>;
}