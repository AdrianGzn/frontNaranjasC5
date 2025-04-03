import Caja from "../../caja/domain/caja.entity";
import Lote from "./lote.entity";

export interface LoteDetailsResponse {
    lote: Lote;
    cajas: Caja[];
}