export interface Box {
    id: number
    fecha: Date | string
    peso_total: number
    precio: number
    lote_fk: number
    encargado_fk: number
}