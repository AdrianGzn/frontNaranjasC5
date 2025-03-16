import ILote from "../domain/lote.repository";
import { Lote } from "../domain/lote.entity";
import ResponseDeleteLote from "../domain/response_delete_lote";
import ResponseUpdateLote from "../domain/response_update_lote";

export default class APIRepositoryLote implements ILote {
  private cajasURL = `${import.meta.env.API_URL}/lotes`;

  async Create(): Promise<Lote> {
    const response = await fetch(`${this.cajasURL}`, {
      method: "POST",
    });
    if (!response.ok) throw new Error("Error al crear el lote");
    return response.json();
  }

  async Update(id: number, lote: Lote): Promise<ResponseUpdateLote> {
    const response = await fetch(`${this.cajasURL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(lote),
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Error al editar el lote");
    return response.json();
  }

  async ConsultLote(): Promise<Lote> {
    const response = await fetch(this.cajasURL);
    if (!response.ok) throw new Error("Error al consultar el lote");
    return response.json();
  }

  async ConsultLotes(): Promise<Lote[]> {
    const response = await fetch(this.cajasURL);
    if (!response.ok) throw new Error("Error al consultar el lote");
    return response.json();
  }

  async Delete(id: number): Promise<ResponseDeleteLote> {
    const response = await fetch(`${this.cajasURL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Error al eliminar el lote");
    return response.json();
  }
}
