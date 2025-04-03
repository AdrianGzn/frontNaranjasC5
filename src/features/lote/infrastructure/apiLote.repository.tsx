import ILote from "../domain/lote.repository";
import Lote from "../domain/lote.entity";
import { CreateLoteRequest } from "../domain/CreateLoteRequest";
import { CreatedLoteResponse } from "../domain/CreatedLoteResponse";
import { LoteDetailsResponse } from "../domain/LoteDetailsResponse";

export default class APIRepositoryLote implements ILote {

  private cajasURL = `${import.meta.env.VITE_API_URL}/lotes`;
  async Create(lote: CreateLoteRequest): Promise<CreatedLoteResponse> {
    const response = await fetch(`${this.cajasURL}/with-cajas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lote),
    });
    if (!response.ok) throw new Error("Error al crear el lote");
    return response.json();
  }

  async Update(id: number, lote: Lote): Promise<Lote> {
    const response = await fetch(`${this.cajasURL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(lote),
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Error al editar el lote");
    return response.json();
  }

  async ConsultLote(id: number): Promise<Lote> {
    const response = await fetch(`${this.cajasURL}/${id}`);
    if (!response.ok) throw new Error("Error al consultar el lote");
    return response.json();
  }

  async ConsultLotes(id: number): Promise<Lote[]> {
    const response = await fetch(`${this.cajasURL}/user/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    console.log("response", response.body)
    if (!response.ok) throw new Error("Error al consultar el lote");
    return response.json();
  }

  async Delete(id: number): Promise<any> {
    const response = await fetch(`${this.cajasURL}/${id}`, {
      method: "DELETE",

    });
    if (!response.ok) throw new Error("Error al eliminar el lote");
    return response.json();
  }

  async GetLoteDetails(id: number): Promise<LoteDetailsResponse> {
    const response = await fetch(`${this.cajasURL}/with-cajas/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Error al obtener detalles del lote");
    return response.json();
  }

  async GetLotesDetailsByUserID(userId: number): Promise<LoteDetailsResponse[]> {
    const response = await fetch(`${this.cajasURL}/user/${userId}/with-cajas`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Error al obtener lotes por usuario");
    return response.json();
  }

  async GetLotesDetailsByDateRange(userId: number, startDate: string, endDate: string): Promise<LoteDetailsResponse[]> {
    const url = `${this.cajasURL}/user/${userId}/with-cajas/date-range?start_date=${startDate}&end_date=${endDate}`;

    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) throw new Error("Error al obtener lotes por rango de fechas");
    return response.json();
  }
}
