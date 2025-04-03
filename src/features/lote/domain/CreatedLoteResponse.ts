import Caja from "../../caja/domain/caja.entity";
import Lote from "./lote.entity";

export interface CreatedLoteResponse {
    lote: Lote
    cajas: Caja[]
}