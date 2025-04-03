export interface CreateLoteRequest {
    lote: {
        "observaciones": string
        "user_id": number
    }
    esp32_fk: string
}