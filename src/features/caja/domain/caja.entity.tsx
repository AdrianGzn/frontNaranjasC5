export default interface Caja {
    id: number
    descripcion: string
    peso_total: number
    precio: number
    lote_fk: number
    encargado_fk: number
    cantidad: number
    estado: string
    esp32Fk: string
}