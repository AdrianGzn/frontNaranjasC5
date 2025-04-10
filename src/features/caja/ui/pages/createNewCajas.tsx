import { useState, useEffect } from "react";
import Dashboard from "../../../../shared/ui/pages/dashboard.component";
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
// import TableCajas from "../components/tableCajas.component";
import Caja from "../../domain/caja.entity";
import CajasCargando from "../components/cajasCargando.component";
import CajasCargar from "../components/cajaCargar.component";
import { useWebSocket } from "../../../../shared/hooks/websocket.provider";
import { User } from "../../../users/domain/user.entity";
import useCreateLote from "../../../lote/infrastructure/create_lote.controller";
import useCreateCaja from "../../infrastructure/createCaja.controller";
import useGetCajas from "../../infrastructure/consultCajas.controller";
import useAsignCaja from "../../infrastructure/asignCaja.controller";
// import useGetEsps from "../../../esp32/infrastructure/getEsps.controller";
import Esp32 from "../../../esp32/domain/esp32.entity";
import useGetUsers from "../../../users/infrastructure/controllers/getAllUsersController";
import { useCajasStore } from "../../../../data/cajasStore";
import useGetEspsId from "../../../esp32/infrastructure/getEsp32IdController";
import { AuthService, StoredUser } from "../../../../shared/hooks/auth_user.service";
import { useNaranjasStore } from "../../../../data/naranjaStore";
import { Naranja } from "../../../../shared/models/Naranja";
import { CreateLoteRequest } from "../../../lote/domain/CreateLoteRequest";

export default function CreateNewCajas() {
  const { addConnection } = useWebSocket();
  const [cajasCargando, setCajasCargando] = useState<Caja[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [dataUser, setDataUser] = useState<StoredUser | null>(null)
  const { addCaja, cajasStore } = useCajasStore()
  const [actualizar, setActialuzar] = useState<boolean>(false);
  const { lote, createLote } = useCreateLote();
  const { createCaja } = useCreateCaja();
  const { cajasResult, consultCajas } = useGetCajas();
  const { asignCaja } = useAsignCaja();
  const { espsResult, consultEspsId } = useGetEspsId();
  const { usersResult, consultUsers } = useGetUsers();
  const { addNaranja } = useNaranjasStore();

  // Initial data loading
  useEffect(() => {
    const userData = AuthService.getUserData();
    if (userData) {
      setDataUser(userData);
      consultEspsId(userData.id);
      consultUsers();
      consultCajas();
    }
  }, []);

  useEffect(() => {
    if (dataUser && cajasResult && espsResult && usersResult) { // Add checks for all required data
      // Filter ESP32s for supervisor
      const filteredEsps = espsResult.filter((esp: Esp32) =>
        esp.id_propietario === dataUser.id_jefe
      );

      // Filter users with same supervisor
      const filteredUsers = usersResult.filter((user: User) =>
        user.idJefe === dataUser.id_jefe
      );
      setUsers(filteredUsers);

      // Filter loading cajas
      const cajasFiltered = cajasResult.filter((myCaja: Caja) =>
        myCaja.estado === ''
      );
      setCajasCargando(cajasFiltered);

      // Filter supervisor's cajas and update store
      const cajasJefe = cajasResult.filter((myCaja: Caja) =>
        filteredEsps.some(esp => esp.id === myCaja.esp32Fk)
      );

      // Clear and update store instead of pushing
      if (cajasJefe.length > 0) {
        cajasStore.splice(0, cajasStore.length, ...cajasJefe);
      }
    }
  }, [cajasResult, espsResult, usersResult, dataUser]);


  const onCreate = async (id: number | undefined) => {
    try {
      // Verifica que tengas al menos un ESP32 disponible
      if (!espsResult || espsResult.length === 0) {
        throw new Error('No hay dispositivos ESP32 disponibles');
      }

      // Crea un objeto CreateLoteRequest en lugar de Lote
      const loteRequest: CreateLoteRequest = {
        lote: {
          observaciones: '',
          user_id: dataUser?.id || 0
        },
        esp32_fk: espsResult[0].id // Usa el primer ESP32 disponible o añade lógica para seleccionar uno específico
      };

      await createLote(loteRequest);

      if (lote?.id) {
        const nuevasCajas: Caja[] = Array(3).fill(null).map(() => ({
          id: 0,
          descripcion: 'cargando',
          peso_total: 0,
          precio: 0,
          lote_fk: lote.id,
          encargado_fk: id,
          cantidad: 0,
          estado: '',
          esp32Fk: ''
        }));

        setCajasCargando(nuevasCajas);
        await Promise.all(nuevasCajas.map(caja => createCaja(caja)));
      } else {
        throw new Error('Error al crear el lote');
      }
    } catch (error) {
      console.error('Error creating lote and cajas:', error);
      // Add proper error handling/user feedback here
    }
  };

  const onStop = (id: number | undefined) => { // para detener la carga en las cajas
    console.log(id);

    consultCajas();
    let misCajas: Caja[] = cajasResult.filter((miCaja: Caja) => miCaja.estado === '')
    misCajas.forEach((caja: Caja) => {
      caja.id = caja.id,
        caja.descripcion = caja.descripcion,
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

  // WebSocket para naranjas
  useEffect(() => {
    const socket: WebSocket = addConnection("ws://52.4.21.111:8085/naranjas/")

    socket.onopen = (message) => {
      console.log("Conectado al WebSocket de naranjas", message)
    }

    socket.onmessage = (message: MessageEvent) => {
      try {
        const naranja: Naranja = JSON.parse(message.data);
        // Validar que los datos sean correctos
        if (naranja.id && naranja.peso && naranja.caja_fk) {
          addNaranja(naranja);

          // Actualizar la caja correspondiente si es necesario
          const cajaAfectada = cajasStore.find(caja => caja.id === naranja.caja_fk);
          if (cajaAfectada) {
            cajaAfectada.cantidad = (cajaAfectada.cantidad || 0) + 1;
            cajaAfectada.peso_total = (cajaAfectada.peso_total || 0) + naranja.peso;
          }
        }
      } catch (error) {
        console.error('Error al procesar naranja:', error);
      }
    }

    socket.onerror = (error) => {
      console.error('Error en WebSocket de naranjas:', error);
    }

    return () => {
      socket.close();
      console.log("WebSocket de naranjas cerrado");
    }
  }, [])

  return (
    <div className="w-full h-screen">
      <Dashboard>
        <div className="w-full h-full flex flex-col items-center">
          <CajasCargar suggestions={users} onCreate={onCreate} onStop={onStop} esp32={espsResult}></CajasCargar>
          <CajasCargando cajas={cajasCargando}></CajasCargando>
        </div>
      </Dashboard>
    </div>
  );
}