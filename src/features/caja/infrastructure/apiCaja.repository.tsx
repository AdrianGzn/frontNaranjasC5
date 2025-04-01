import ICaja from "../domain/caja.repository";
import Caja from "../domain/caja.entity";

export default class APIRepositoryCaja implements ICaja {
  private cajasURL = `http://52.4.21.111:8082/cajas`;

  async Create(caja: Caja): Promise<Caja> {
    const response = await fetch(`${this.cajasURL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(caja),
    });
    if (!response.ok) throw new Error("Error al crear la caja");
    return response.json();
  }

  async Asign(id: number, caja: Caja): Promise<Caja> {
    const response = await fetch(`${this.cajasURL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(caja),
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Error al asignar la caja");
    return response.json();
  }

  async ConsultCaja(id: number): Promise<Caja> {
    const response = await fetch(`${this.cajasURL}/${id}`);
    if (!response.ok) throw new Error("Error al consultar la caja");
    return response.json();
  }

  async ConsultCajas(): Promise<Caja[]> {
    const response = await fetch(`${this.cajasURL}/`);
    if (!response.ok) throw new Error("Error al consultar las cajas");
    return response.json();
  }

  async Delete(id: number): Promise<any> {
    const response = await fetch(`${this.cajasURL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Error al eliminar la caja");
    return response.json();
  }

  async GetByLote(id: number): Promise<Caja[]> {
    const response = await fetch(`${this.cajasURL}/cajas/lote/${id}`);
    if (!response.ok) throw new Error("Error al eliminar la caja");
    return response.json();
  }
}
