import React, { useState, useEffect, useCallback } from "react";
import Dashboard from "../../../../shared/ui/pages/dashboard.component";
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import TableCajas from "../components/tableCajas.component";
import Caja from "../../domain/caja.entity";
import CajasCargando from "../components/cajasCargando.component";
import CajasCargar from "../components/cajaCargar.component";
import { useWebSocket } from "../../../../shared/hooks/websocket.provider";
import { User } from "../../../users/domain/user.entity";
import useCreateLote from "../../../lote/infrastructure/create_lote.controller";
import useCreateCaja from "../../infrastructure/createCaja.controller";
import Lote from "../../../lote/domain/lote.entity";
import useGetCajas from "../../infrastructure/consultCajas.controller";
import useAsignCaja from "../../infrastructure/asignCaja.controller";

export default function CreateNewCajas() {

  const { addConnection, messages } = useWebSocket();
  const [size, setSize] = useState<'small' | 'large' | 'normal' | undefined>('small');
  const [cajas, setCajas] = useState<any[]>([]);
  const [cajasCargando, setCajasCargando] = useState<any>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [crearLote, setCrearLote] = useState(false);
  const [encargadoId, setEncargadoId] = useState<number>(0);
  const [idLote, setIdLote] = useState<number>(0)

  const { createLote } = useCreateLote();
  const { createCaja } = useCreateCaja();
  const { cajasResult, consultCajas } = useGetCajas();
  const { asignCaja } = useAsignCaja();

  const sizeOptions = [
    { label: 'Small', value: 'small' },
    { label: 'Medium', value: 'normal' },
    { label: 'Large', value: 'large' }
  ];

  const getCajasSocket = useCallback(() => {
    const socket: WebSocket = addConnection("ws://localhost:8081/cajas/")
    socket.onopen = (message) => {
      console.log("message connect", message)
    }
    socket.onmessage = (message: any) => {
      try {
        const data = JSON.parse(message.data);
        console.log("Mensaje recibido:", data);
        setCajas((prev: any) => [...prev, data]);

        return () => socket.close()
      } catch (error) {
        console.error("Error al parsear message.data:", error);
      }
    }
  }, [])

  useEffect(() => {
    getCajasSocket();
    console.log("cajas", cajas)
    let cajasFiltred = cajas.filter((item: any) =>   item.estatus?.toLowerCase() === "cargando")
    console.log("cajas cargando", cajasFiltred)
    setCajasCargando(cajasFiltred);

    setUsers([ //usuarios filtrados
      { id: 1, name: "Juan Pérez", username: "juanp", email: "juan.perez@example.com", password: "123456", rol: "admin" },
      { id: 2, name: "María López", username: "marial", email: "maria.lopez@example.com", password: "abcdef", rol: "user" },
      { id: 3, name: "José Gómez", username: "carlitos", email: "carlos.gomez@example.com", password: "qwerty", rol: "moderator" },
      { id: 4, name: "Ana Rodríguez", username: "anar", email: "ana.rodriguez@example.com", password: "password123", rol: "user" },
      { id: 5, name: "Luis Fernández", username: "luisf", email: "luis.fernandez@example.com", password: "abc123", rol: "admin" },
      { id: 6, name: "Sofía Martínez", username: "sofim", email: "sofia.martinez@example.com", password: "sofipass", rol: "user" },
      { id: 7, name: "Josefina Sánchez", username: "pedros", email: "pedro.sanchez@example.com", password: "pedro321", rol: "moderator" }
    ]);

  }, [getCajasSocket]);

  const onCreate = (id: number) => {
    console.log(id);
    setEncargadoId(id);
    setCrearLote(!crearLote)
  }

  useEffect(() => { // crea el lote y guarda el id
    const newLote: Lote = { id: 0, fecha: '', observaciones: '', user_id: encargadoId };
    createLote(newLote);
    setIdLote(newLote.id)
  }, [crearLote])

  useEffect(() => { //crear las 3 cajas con el id del lote y el id del usuario
    const nuevasCajas: Caja[] = [
      { id: 0, descripción: 'cargando', peso_total: 0, precio: 0, lote_fk: idLote, encargado_fk: encargadoId, cantidad: 0, estado: '', esp32Fk: '' },
      { id: 0, descripción: 'cargando', peso_total: 0, precio: 0, lote_fk: idLote, encargado_fk: encargadoId, cantidad: 0, estado: '', esp32Fk: '' },
      { id: 0, descripción: 'cargando', peso_total: 0, precio: 0, lote_fk: idLote, encargado_fk: encargadoId, cantidad: 0, estado: '', esp32Fk: '' }
    ];

    nuevasCajas.forEach((caja) => createCaja(caja));
  }, [idLote]);

  const onStop = (id: number) => { // para detener la carga en las cajas
    console.log(id);
    setEncargadoId(id);
  }

  useEffect(() => {
    consultCajas();
    let misCajas: Caja[] = cajasResult.filter((miCaja: Caja) => miCaja.estado === 'cargando')
    misCajas.forEach((caja: Caja) => {
      caja.id = caja.id,
        caja.descripción = 'terminado',
        caja.peso_total = caja.peso_total,
        caja.precio = caja.precio,
        caja.lote_fk = caja.lote_fk,
        caja.encargado_fk = caja.encargado_fk,
        caja.cantidad = caja.cantidad,
        caja.estado = caja.estado,
        caja.esp32Fk = caja.esp32Fk
    });
    misCajas.forEach((caja: Caja) => asignCaja(caja.id, caja));

  }, [encargadoId])

  //para el websocket
  return (
    <div className="w-full h-screen">
      <Dashboard>
        <div className="w-full h-full flex flex-col items-center">
          <CajasCargar suggestions={users} onCreate={onCreate} onStop={onStop}></CajasCargar>
          {
            cajasCargando.length > 0 ? (
              <CajasCargando cajas={cajasCargando}></CajasCargando>
            ): (
              <p>
                No hay cajas cargando
              </p>
            )
          }

          {
            cajas.length > 0 ? (
              <TableCajas size={size} setSize={setSize} sizeOptions={sizeOptions} cajas={cajas} ></TableCajas>
            ) : (
              <p>
                No hay cajas
              </p>
            )
          }
        </div>
      </Dashboard>
    </div>
  );
}