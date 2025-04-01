import ILote from "../domain/lote.repository";
import Lote from "../domain/lote.entity";

export default class APIRepositoryLote implements ILote {
  private cajasURL = `${import.meta.env.VITE_API_URL}/lotes`;

  async Create(lote: Lote): Promise<Lote> {
    const response = await fetch(`${this.cajasURL}/`, {
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

  async ConsultLotes(): Promise<Lote[]> {
    const response = await fetch(`${this.cajasURL}/`);
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
}
