export default interface Caja {
    id: number
    descripción: string
    peso_total: number
    precio: number
    lote_fk: number
    encargado_fk: number | undefined
    cantidad: number
    estado: string
    esp32Fk: string
}