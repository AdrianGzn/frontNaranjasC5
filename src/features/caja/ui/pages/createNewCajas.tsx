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
import useGetEsps from "../../../esp32/infrastructure/getEsps.controller";
import Esp32 from "../../../esp32/domain/esp32.entity";
import { LoginResponse } from "../../../users/domain/LoginResponse";
import useGetUsers from "../../../users/infrastructure/controllers/getAllUsersController";
import { useCajasStore } from "../../../../data/cajasStore";
import useGetEspsId from "../../../esp32/infrastructure/getEsp32IdController";
import { getEsp32Id } from "../../../esp32/application/getEsp32IsUseCase";
import { AuthService, StoredUser } from "../../../../shared/hooks/auth_user.service";

export default function CreateNewCajas() {
  const [size, setSize] = useState<'small' | 'large' | 'normal' | undefined>('small');
  const { addConnection, messages } = useWebSocket();
  const [cajasCargando, setCajasCargando] = useState<Caja[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [encargadoId, setEncargadoId] = useState<number>(0);
  const [idLote, setIdLote] = useState<number>(0)
  const [esps, setEsps] = useState<Esp32[]>([])
  const [dataUser, setDataUser] = useState<StoredUser | null>(null)
  const { addCaja, cajasStore } = useCajasStore()
  const [actualizar, setActialuzar] = useState<boolean>(false);
  const { lote, createLote } = useCreateLote();
  const { createCaja } = useCreateCaja();
  const { cajasResult, consultCajas, error, loading } = useGetCajas();
  const { asignCaja } = useAsignCaja();
  const { espsResult, consultEspsId } = useGetEspsId();
  const { usersResult, consultUsers } = useGetUsers();
  const [data, setData] = useState<any[]>([])
  const sizeOptions = [
    { label: 'Small', value: 'small' },
    { label: 'Medium', value: 'normal' },
    { label: 'Large', value: 'large' }
  ];
  useEffect(() => {
    const userData = AuthService.getUserData()
    console.log("user data", userData)
    if (userData) {
      setDataUser(userData);
      const id = userData.id;
      consultEspsId(id)
      consultUsers();
      consultCajas();
      setData(cajasResult)
      console.log("esp32 get it", espsResult)
    }
  }, []);

  useEffect(() => {
    if (dataUser) {
      //esps del jefe
      let filteredEsps = espsResult.filter((esp: Esp32) => esp.id_propietario === dataUser.id_jefe)
      console.log("esp32 filtreds", filteredEsps)
      setEsps(filteredEsps);

      //Usuarios con el mismo jefe

      let filteredUsers = usersResult.filter((user: User) => user.idJefe === dataUser.id_jefe)
      console.log("users", filteredUsers)
      setUsers(filteredUsers)

      //cajas "cargando" del usuario
      console.log("cajas result", cajasResult)

      let cajasFiltered = cajasResult.filter((myCaja: Caja) => myCaja.estado === '')
      setCajasCargando(cajasFiltered);

      //todas las cajas del jefe
      const cajasJefe = cajasResult.filter((myCaja: Caja) =>
        esps.some((esp) => esp.id === myCaja.esp32Fk)
      );
      cajasJefe.map((item) => {
        cajasStore.push(item)
      })
    }
  }, [cajasResult, espsResult, usersResult, encargadoId, dataUser, actualizar])


  const onCreate = (id: number) => {  //handler para crear
    console.log(id);
    setEncargadoId(id);

    const newLote: Lote = { id: 0, fecha: '', observaciones: '', user_id: dataUser?.id };
    console.log("new lote",  newLote)
    createLote(newLote).then(() => { //crea mi lote
      if (lote) {
        setIdLote(lote.id);

        const nuevasCajas: Caja[] = [
          { id: 0, descripción: 'cargando', peso_total: 0, precio: 0, lote_fk: idLote, encargado_fk: id, cantidad: 0, estado: '', esp32Fk: '' },
          { id: 0, descripción: 'cargando', peso_total: 0, precio: 0, lote_fk: idLote, encargado_fk: id, cantidad: 0, estado: '', esp32Fk: '' },
          { id: 0, descripción: 'cargando', peso_total: 0, precio: 0, lote_fk: idLote, encargado_fk: id, cantidad: 0, estado: '', esp32Fk: '' }
        ];

        setCajasCargando(nuevasCajas);
        nuevasCajas.forEach((caja) => createCaja(caja)); //crea mis cajas
      } else {
        console.log('lote no creado');
      }
    });
  }

  const onStop = (id: number) => { // para detener la carga en las cajas
    console.log(id);
    setEncargadoId(id);

    consultCajas();
    let misCajas: Caja[] = cajasResult.filter((miCaja: Caja) => miCaja.estado === 'cargando' && miCaja.encargado_fk === encargadoId)
    misCajas.forEach((caja: Caja) => {
      caja.id = caja.id,
        caja.descripción = caja.descripción,
        caja.peso_total = caja.peso_total,
        caja.precio = caja.precio,
        caja.lote_fk = caja.lote_fk,
        caja.encargado_fk = caja.encargado_fk,
        caja.cantidad = caja.cantidad,
        caja.estado = 'terminado',
        caja.esp32Fk = caja.esp32Fk
    });
    misCajas.forEach((caja: Caja) => asignCaja(caja.id, caja));
    setActialuzar(!actualizar)
  }



  //websocket
  useEffect(() => {
    const socket: WebSocket = addConnection("ws://52.4.21.111:8085/cajas/")

    socket.onopen = (message) => {
      console.log("message connect", message)
    }

    socket.onmessage = (message: any) => {
      const data = JSON.parse(message.data);
      addCaja(data)
    }

    return () => {
      socket.close()
      console.log("ws close");
    }
  }, [])

  return (
    <div className="w-full h-screen">
      <Dashboard>
        <div className="w-full h-full flex flex-col items-center">
          <CajasCargar suggestions={users} onCreate={onCreate} onStop={onStop} esp32={espsResult}></CajasCargar>
          <CajasCargando cajas={cajasCargando}></CajasCargando>
          <TableCajas size={size} setSize={setSize} sizeOptions={sizeOptions} cajas={cajasStore} ></TableCajas>
        </div>
      </Dashboard>
    </div>
  );
}