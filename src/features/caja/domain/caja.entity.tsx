export default interface Caja {
    id: number
    descripción: string
    peso_total: number
    precio: number
    lote_fk: number
    encargado_fk: number
    cantidad: number
}