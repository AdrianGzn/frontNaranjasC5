import { useEffect, useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import Dashboard from '../../shared/ui/pages/dashboard.component';
import { useWebSocket } from '../../shared/hooks/websocket.provider';
import { useNaranjasStore } from '../../data/naranjaStore';
import { Naranja } from '../../shared/models/Naranja';
import { AuthService } from '../../shared/hooks/auth_user.service';

export const NaranjasMonitor = () => {
    const toast = useRef<Toast>(null);
    const { addConnection } = useWebSocket();
    const { addNaranja, naranjasStore, clearNaranjas } = useNaranjasStore();
    const [loading, setLoading] = useState(false);
    const userData = AuthService.getUserData();

    useEffect(() => {
        setLoading(true);
        console.log("role ", userData?.rol)
        console.log("id_jefe", userData?.id_jefe)
        console.log("id user", userData?.id)
        let id = 0;

        if (userData?.rol === "dueño") {
            id = userData.id;
        } else if (userData?.rol === "encargado" || userData?.rol === "recolector") {
            id = userData?.id_jefe ?? 0;
        }

        if (!id) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'No se pudo determinar el ID del usuario para conectarse',
                life: 3000
            });
            setLoading(false);
            return;
        }

        const socket = addConnection(`ws://52.4.21.111:8085/naranjas/?id=${id}`);

        socket.onopen = () => {
            toast.current?.show({
                severity: 'success',
                summary: 'Conectado',
                detail: 'Conexión establecida con el servidor de naranjas',
                life: 3000
            });
            setLoading(false);
        };

        socket.onmessage = (message: MessageEvent) => {
            try {
                const parsedData = JSON.parse(message.data);
                const naranja = parsedData?.naranja as Naranja;

                if (naranja && naranja.id && naranja.peso > 0 && naranja.caja_fk > 0) {
                    addNaranja(naranja);
                }
            } catch (error) {
                console.error('Error procesando naranja:', error);
            }
        };

        socket.onerror = () => {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Error en la conexión con el servidor',
                life: 3000
            });
            setLoading(false);
        };

        return () => {
            socket.close();
            clearNaranjas();
        };
    }, []);

    const formatDate = (value: string) => {
        return new Date(value).toLocaleString();
    };

    const colorTemplate = (rowData: Naranja) => {
        return (
            <span className={`px-2 py-1 rounded-full text-white
                ${rowData.color === 'verde' ? 'bg-green-500' :
                    rowData.color === 'naranja' ? 'bg-orange-500' : 'bg-gray-500'}`}>
                {rowData.color}
            </span>
        );
    };

    const pesoTemplate = (rowData: Naranja) => {
        return `${rowData.peso}g`;
    };

    return (
        <Dashboard>
            <div className="p-4">
                <Toast ref={toast} />

                <div className="mb-4">
                    <h2 className="text-2xl font-semibold text-amber-800">Monitor de Naranjas en Tiempo Real</h2>
                    <p className="text-amber-700">Visualización de naranjas procesadas</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card className="border border-amber-200 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="bg-amber-100 p-3 rounded-lg">
                                <i className="pi pi-box text-amber-600 text-xl"></i>
                            </div>
                            <div>
                                <p className="text-amber-700">Total Naranjas</p>
                                <p className="text-2xl font-bold text-amber-800">
                                    {naranjasStore.length}
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="border border-amber-200 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="bg-amber-100 p-3 rounded-lg">
                                <i className="pi pi-chart-line text-amber-600 text-xl"></i>
                            </div>
                            <div>
                                <p className="text-amber-700">Peso Total</p>
                                <p className="text-2xl font-bold text-amber-800">
                                    {naranjasStore.reduce((acc, curr) => acc + curr.peso, 0)}g
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="border border-amber-200 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="bg-amber-100 p-3 rounded-lg">
                                <i className="pi pi-clock text-amber-600 text-xl"></i>
                            </div>
                            <div>
                                <p className="text-amber-700">Última Actualización</p>
                                <p className="text-lg font-bold text-amber-800">
                                    {naranjasStore.length > 0
                                        ? formatDate(naranjasStore[naranjasStore.length - 1].hora)
                                        : 'Sin datos'}
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>

                <Card className="border border-amber-200 shadow-md">
                    <DataTable
                        value={naranjasStore}
                        loading={loading}
                        scrollable
                        scrollHeight="500px"
                        className="p-datatable-sm"
                        sortField="hora"
                        sortOrder={-1}
                        rows={50}
                    >
                        <Column field="id" header="ID" sortable />
                        <Column field="peso" header="Peso" body={pesoTemplate} sortable />
                        <Column field="tamano" header="Tamaño" sortable />
                        <Column field="color" header="Color" body={colorTemplate} sortable />
                        <Column
                            field="hora"
                            header="Hora"
                            body={(rowData: Naranja) => formatDate(rowData.hora)}
                            sortable
                        />
                        <Column field="caja_fk" header="Caja ID" sortable />
                        <Column field="esp32_fk" header="ESP32" sortable />
                    </DataTable>
                </Card>
            </div>
        </Dashboard>
    );
};
