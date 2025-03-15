import ICaja from "../domain/caja.repository";
import Caja from "../domain/caja.entity";
import ResponseDeleteCaja from "../domain/response_delete_caja";
import ResponseUpdateCaja from "../domain/response_update_caja";

export default class APIRepositoryCaja implements ICaja {
  private cajasURL = `${import.meta.env.API_URL}/cajas`;

  async Create(): Promise<Caja> {
    const response = await fetch(`${this.cajasURL}`, {
      method: "POST",
    });
    if (!response.ok) throw new Error("Error al crear la caja");
    return response.json();
  }

  async Asign(id: number, caja: Caja): Promise<ResponseUpdateCaja> {
    const response = await fetch(`${this.cajasURL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(caja),
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Error al asignar la caja");
    return response.json();
  }

  async ConsultCaja(): Promise<Caja> {
    const response = await fetch(`${this.cajasURL}/current`);
    if (!response.ok) throw new Error("Error al consultar la caja");
    return response.json();
  }

  async ConsultCajas(): Promise<Caja[]> {
    const response = await fetch(this.cajasURL);
    if (!response.ok) throw new Error("Error al consultar las cajas");
    return response.json();
  }

  async Delete(id: number): Promise<ResponseDeleteCaja> {
    const response = await fetch(`${this.cajasURL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Error al eliminar la caja");
    return response.json();
  }
}
