import ILote from "../domain/lote.repository";
import Lote from "../domain/lote.entity";

export default class APIRepositoryLote implements ILote {
<<<<<<< HEAD
  private cajasURL = `${import.meta.env.VITE_API_URL}/lotes`;
=======
  private cajasURL = `http://52.4.21.111:8082/lotes`;
>>>>>>> ba60d49dbd169782a9010555a969906aa193476c

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
    const response = await fetch(`${this.cajasURL}/`, {
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
}
