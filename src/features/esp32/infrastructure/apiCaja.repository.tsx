import IEsp32 from "../domain/esp32.repository";
import Esp32 from "../domain/esp32.entity";

export default class APIRepositoryEsps implements IEsp32 {
  private espsURL = `${import.meta.env.VITE_API_URL}/esp32`;

  async Create(esp: Esp32): Promise<Esp32> {
    console.log(this.espsURL);

    const response = await fetch(`${this.espsURL}/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(esp),
    })
    if (!response.ok) throw new Error("Error al crear la esp");
    return response.json();
  }

  async Update(id: number, esp: Esp32): Promise<Esp32> {
    const response = await fetch(`${this.espsURL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(esp),
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Error al asignar la esp");
    return response.json();
  }

  async GetEsp(id: number): Promise<Esp32> {
    const response = await fetch(`${this.espsURL}/${id}`);
    if (!response.ok) throw new Error("Error al consultar la esp");
    return response.json();
  }

  async GetEspId(id: number): Promise<Esp32[]> {
    const response = await fetch(`${this.espsURL}/propietario/${id}`)
    if (!response.ok) throw new Error("error al consultar la esp")
    return response.json()
  }

  async GetEspIdWaiting(id: number): Promise<Esp32[]> {
    const response = await fetch(`${this.espsURL}/propietario/${id}/waiting`);
    if (!response.ok) throw new Error("Error al consultar ESP32 en espera");
    return response.json();
  }

  async GetEsps(): Promise<Esp32[]> {
    const response = await fetch(`${this.espsURL}/`);
    if (!response.ok) throw new Error("Error al consultar las esps");
    return response.json();
  }

  async Delete(id: string): Promise<any> {
    const response = await fetch(`${this.espsURL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Error al eliminar la esp");
    return response.json();
  }

  async StopLoading(esp32Id: string): Promise<Esp32> {
    const response = await fetch(`${import.meta.env.VITE_API_URL_API_STATUS}/esp32/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "esp32_fk": esp32Id,
            "content": "esperando"
        }),
    });
    
    if (!response.ok) throw new Error("Error al detener la carga de la ESP32");
    return response.json();
  }
}
