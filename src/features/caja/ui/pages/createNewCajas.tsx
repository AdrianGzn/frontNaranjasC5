import React, { useState, useEffect } from "react";
import Dashboard from "../../../../shared/ui/pages/dashboard.component";
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import TableCajas from "../components/tableCajas.component";
import Caja from "../../domain/caja.entity";
import AddCajas from "../components/cajasCargando.component";
import CajasCargando from "../components/cajaCargar.component";


export default function CreateNewCajas() {
  const [size, setSize] = useState<'small' | 'large' | 'normal' | undefined>('small');
  const [cajas, setCajas] = useState<Caja[]>([]);
  const [cajasCargando, setCajasCargando] = useState<Caja[]>([])

  const sizeOptions = [
    { label: 'Small', value: 'small' },
    { label: 'Medium', value: 'normal' },
    { label: 'Large', value: 'large' }
  ];

  useEffect(() => {
    setCajas([
      { id: 1, descripción: 'Caja 1', peso_total: 100, precio: 10, hora_inicio: '', hora_fin: '', lote_fk: 1, encargado_fk: 1, cantidad: 100 },
      { id: 2, descripción: 'Caja 1', peso_total: 100, precio: 10, hora_inicio: '', hora_fin: '', lote_fk: 1, encargado_fk: 1, cantidad: 100 },
      { id: 3, descripción: 'Caja 1', peso_total: 100, precio: 10, hora_inicio: '', hora_fin: '', lote_fk: 1, encargado_fk: 1, cantidad: 100 },
      { id: 4, descripción: 'Caja 1', peso_total: 100, precio: 10, hora_inicio: '', hora_fin: '', lote_fk: 1, encargado_fk: 1, cantidad: 100 },
      { id: 5, descripción: 'Caja 1', peso_total: 100, precio: 10, hora_inicio: '', hora_fin: '', lote_fk: 1, encargado_fk: 1, cantidad: 100 },
      { id: 6, descripción: 'Caja 1', peso_total: 100, precio: 10, hora_inicio: '', hora_fin: '', lote_fk: 1, encargado_fk: 1, cantidad: 100 },
      { id: 7, descripción: 'Caja 1', peso_total: 100, precio: 10, hora_inicio: '', hora_fin: '', lote_fk: 1, encargado_fk: 1, cantidad: 100 },
      { id: 8, descripción: 'Caja 1', peso_total: 100, precio: 10, hora_inicio: '', hora_fin: '', lote_fk: 1, encargado_fk: 1, cantidad: 100 },
      { id: 9, descripción: 'Caja 1', peso_total: 100, precio: 10, hora_inicio: '', hora_fin: '', lote_fk: 1, encargado_fk: 1, cantidad: 100 },
    ]);
    setCajasCargando([
      { id: 1, descripción: 'Caja 1', peso_total: 100, precio: 10, hora_inicio: '', hora_fin: '', lote_fk: 1, encargado_fk: 1, cantidad: 100 },
      { id: 2, descripción: 'Caja 1', peso_total: 100, precio: 10, hora_inicio: '', hora_fin: '', lote_fk: 1, encargado_fk: 1, cantidad: 100 },
      { id: 3, descripción: 'Caja 1', peso_total: 100, precio: 10, hora_inicio: '', hora_fin: '', lote_fk: 1, encargado_fk: 1, cantidad: 100 }
    ]);
  }, []);

  return (
    <div className="w-full h-screen">
      <Dashboard>
        <div className="w-full h-full flex flex-col items-center">
          <CajasCargando></CajasCargando>
          <AddCajas cajas={cajasCargando}></AddCajas>
          <TableCajas size={size} setSize={setSize} sizeOptions={sizeOptions} cajas={cajas} ></TableCajas>
        </div>
      </Dashboard>
    </div>
  );
}