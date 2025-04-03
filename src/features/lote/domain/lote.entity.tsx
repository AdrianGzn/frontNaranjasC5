export default interface Lote {
    id: number
    fecha: Date | string
    observaciones: string
    user_id: number | undefined
}