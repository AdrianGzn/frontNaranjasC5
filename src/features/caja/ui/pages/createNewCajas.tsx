import React, { useState, useEffect } from "react";
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

export default function CreateNewCajas() {
  const [size, setSize] = useState<'small' | 'large' | 'normal' | undefined>('small');
  const [cajas, setCajas] = useState<Caja[]>([]);
  const [cajasCargando, setCajasCargando] = useState<Caja[]>([])
  const [users, setUsers] = useState<User[]>([])

  const sizeOptions = [
    { label: 'Small', value: 'small' },
    { label: 'Medium', value: 'normal' },
    { label: 'Large', value: 'large' }
  ];

  useEffect(() => {
    setCajas([ //cajas del patrón
      { id: 1, descripción: 'Caja 1', peso_total: 100, precio: 10, lote_fk: 1, encargado_fk: 1, cantidad: 100 },
      { id: 2, descripción: 'Caja 1', peso_total: 100, precio: 10, lote_fk: 1, encargado_fk: 1, cantidad: 100 },
      { id: 3, descripción: 'Caja 1', peso_total: 100, precio: 10, lote_fk: 1, encargado_fk: 1, cantidad: 100 },
      { id: 4, descripción: 'Caja 1', peso_total: 100, precio: 10, lote_fk: 1, encargado_fk: 1, cantidad: 100 },
      { id: 5, descripción: 'Caja 1', peso_total: 100, precio: 10, lote_fk: 1, encargado_fk: 1, cantidad: 100 },
      { id: 6, descripción: 'Caja 1', peso_total: 100, precio: 10, lote_fk: 1, encargado_fk: 1, cantidad: 100 },
      { id: 7, descripción: 'Caja 1', peso_total: 100, precio: 10, lote_fk: 1, encargado_fk: 1, cantidad: 100 },
      { id: 8, descripción: 'Caja 1', peso_total: 100, precio: 10, lote_fk: 1, encargado_fk: 1, cantidad: 100 },
      { id: 9, descripción: 'Caja 1', peso_total: 100, precio: 10, lote_fk: 1, encargado_fk: 1, cantidad: 100 },
    ]);
    setCajasCargando([ //cajas cn status = cargando
      { id: 1, descripción: 'Caja 1', peso_total: 100, precio: 10, lote_fk: 1, encargado_fk: 1, cantidad: 100 },
      { id: 2, descripción: 'Caja 1', peso_total: 100, precio: 10, lote_fk: 1, encargado_fk: 1, cantidad: 100 },
      { id: 3, descripción: 'Caja 1', peso_total: 100, precio: 10, lote_fk: 1, encargado_fk: 1, cantidad: 100 }
    ]);
    setUsers([
      {id: 1, name: "Juan Pérez", username: "juanp", email: "juan.perez@example.com", password: "123456", rol: "admin"},
      {id: 2, name: "María López", username: "marial", email: "maria.lopez@example.com", password: "abcdef", rol: "user"},
      {id: 3, name: "José Gómez", username: "carlitos", email: "carlos.gomez@example.com", password: "qwerty", rol: "moderator"},
      {id: 4, name: "Ana Rodríguez", username: "anar", email: "ana.rodriguez@example.com", password: "password123", rol: "user"},
      {id: 5, name: "Luis Fernández", username: "luisf", email: "luis.fernandez@example.com", password: "abc123", rol: "admin"},
      {id: 6, name: "Sofía Martínez", username: "sofim", email: "sofia.martinez@example.com", password: "sofipass", rol: "user"},
      {id: 7, name: "Josefina Sánchez", username: "pedros", email: "pedro.sanchez@example.com", password: "pedro321", rol: "moderator"}
  ]);
  
  }, []);

  const onCreate = (id: number) => {
    console.log(id);
    const loteCreted = useCreateLote({ id: 1, fecha: '', observaciones: ''})
    //const cajaCreated1 = useCreateCaja({id: 0, descripción: 'string', peso_total: 0, precio: 0, lote_fk: loteCreted.lote.id, encargado_fk: id, cantidad: 0})

  }

  const onStop = (id: number) => {
    console.log(id);
    
  }

  //para el websocket
  const {ws}: any = useWebSocket();
  useEffect(() => {
    if (ws) {
      const handleMessage = (event: any) => {
        const message = JSON.parse(event.data);
        console.log('Mensaje recibido:\n', message);
        //aquí se pueden implementar otras acciones
      };
      ws.addEventListener('message', handleMessage);

      return () => {
        ws.removeEventListener('message', handleMessage);
      };
    }
  }, [ws]);

  return (
    <div className="w-full h-screen">
      <Dashboard>
        <div className="w-full h-full flex flex-col items-center">
          <CajasCargar suggestions={users} onCreate={onCreate} onStop={onStop}></CajasCargar>
          <CajasCargando cajas={cajasCargando}></CajasCargando>
          <TableCajas size={size} setSize={setSize} sizeOptions={sizeOptions} cajas={cajas} ></TableCajas>
        </div>
      </Dashboard>
    </div>
  );
}