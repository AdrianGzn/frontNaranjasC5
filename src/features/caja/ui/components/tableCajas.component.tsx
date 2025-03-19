import { SelectButton } from 'primereact/selectbutton';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export default function TableCajas({size, setSize, sizeOptions, cajas}: any) {
    return <div className="w-[95%] h-[275px] m-5 flex flex-col items-center bg-white p-5 rounded-xl">
        <div className="w-full mb-2 flex justify-between">
            <p>Cajas</p>
            <SelectButton
                value={size}
                onChange={(e) => setSize(e.value)}
                options={sizeOptions}
            />
        </div>

        <div className="w-full flex-grow overflow-hidden">
        <DataTable
            value={cajas}
            paginator
            rows={3}
            rowsPerPageOptions={[3, 6, 9, 12]}
            size={size}
            style={{ width: '100%', maxHeight: '100%', overflowY: 'auto', fontSize: '11px' }} 
        >
            <Column field="id" header="Code" />
            <Column field="descripción" header="Descripción" />
            <Column field="peso_total" header="Peso total" />
            <Column field="precio" header="Precio" />
            <Column field="hora_inicio" header="Hora inicio" />
            <Column field="hora_fin" header="Hora fin" />
            <Column field="lote_fk" header="Lote" />
            <Column field="encargado_fk" header="Encargado" />
            <Column field="cantidad" header="Cantidad" />
        </DataTable>
        </div>
    </div>
}