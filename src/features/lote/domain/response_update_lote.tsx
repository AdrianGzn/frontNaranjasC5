import { Lote } from "./lote.entity"

export default interface ResponseUpdateLote {
    status: string
    data: Lote
}