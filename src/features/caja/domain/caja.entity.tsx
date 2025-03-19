export default interface Caja {
    id: number
    descripción: string
    peso_total: number
    precio: number
    hora_inicio: Date | string
    hora_fin: Date | string
    lote_fk: number
    encargado_fk: number
    cantidad: number
}