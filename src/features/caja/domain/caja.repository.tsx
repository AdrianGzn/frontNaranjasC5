import Caja from "./caja.entity"
import ResponseUpdateCaja from "./response_update_caja"
import ResponseDeleteCaja from "./response_delete_caja"

export default interface ICaja {
    Create(): Promise<Caja>
    Asign(id: number, caja: Caja): Promise<ResponseUpdateCaja>
    ConsultCaja(): Promise<Caja>
    ConsultCajas(): Promise<Caja[]>
    Delete(id: number): Promise<ResponseDeleteCaja>
}