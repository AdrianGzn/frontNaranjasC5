import { useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import Dashboard from "../../../../shared/ui/pages/dashboard.component";
import useGetEspsId from "../../infrastructure/getEsp32IdController";
import Esp32 from "../../domain/esp32.entity";
import { AuthService } from "../../../../shared/hooks/auth_user.service";

export default function MonitorEsp32() {
    const toast = useRef<Toast>(null);
    const [esp32List, setEsp32List] = useState<Esp32[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const userId = AuthService.getUserData()?.id || 0;
    const { espsResult, consultEspsId } = useGetEspsId();

    // Cargar datos iniciales
    useEffect(() => {
        if (userId) {
            consultEspsId(userId);
        }
    }, []);

    // Actualizar la lista cuando cambian los resultados
    useEffect(() => {
        if (espsResult) {
            setEsp32List(espsResult);
            setLoading(false);
        }
    }, [espsResult]);

    const confirmStopLoading = (esp32: Esp32) => {
        confirmDialog({
            message: `¿Está seguro de que desea detener la carga en ESP32 ${esp32.id}?`,
            header: 'Confirmar detención',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: () => handleStopLoading(esp32)
        });
    };

    const handleStopLoading = async (esp32: Esp32) => {
        try {
            setLoading(true);

            const response = await fetch(`${import.meta.env.VITE_API_URL}/esp32/${esp32.id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: 'esperando' })
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el estado de la ESP32');
            }

            await consultEspsId(userId);

            toast.current?.show({
                severity: 'success',
                summary: 'Operación exitosa',
                detail: `La ESP32 ${esp32.id} ha sido detenida y cambiada a estado de espera.`,
                life: 3000
            });
        } catch (error) {
            console.error('Error al detener la ESP32:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Ocurrió un error al intentar detener la ESP32. Por favor, inténtelo de nuevo.',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const statusBodyTemplate = (rowData: Esp32) => {
        const colorClass =
            rowData.status === 'activo' ? 'bg-green-100 text-green-800' :
                rowData.status === 'esperando' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800';

        const dotColorClass =
            rowData.status === 'activo' ? 'bg-green-400' :
                rowData.status === 'esperando' ? 'bg-yellow-400' :
                    'bg-red-400';

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
                <span className={`w-2 h-2 mr-1 rounded-full ${dotColorClass}`}></span>
                {rowData.status}
            </span>
        );
    };

    const actionBodyTemplate = (rowData: Esp32) => {
        return (
            <div className="flex justify-center">
                <Button
                    icon="pi pi-stop-circle"
                    className="p-button-rounded p-button-danger"
                    disabled={rowData.status !== 'activo'}
                    onClick={() => confirmStopLoading(rowData)}
                    tooltip="Detener carga"
                    tooltipOptions={{ position: 'top' }}
                />
            </div>
        );
    };

    return (
        <Dashboard>
            <div className="p-4">
                <Toast ref={toast} />
                <ConfirmDialog />

                <div className="mb-4">
                    <h2 className="text-2xl font-semibold text-amber-800">Monitoreo de Dispositivos ESP32</h2>
                    <p className="text-amber-700">Visualice y controle sus dispositivos ESP32</p>
                </div>

                <Card className="border border-amber-200 shadow-md">
                    <DataTable
                        value={esp32List}
                        paginator
                        rows={10}
                        loading={loading}
                        emptyMessage="No se encontraron dispositivos ESP32"
                        className="p-datatable-sm"
                    >
                        <Column field="id" header="ID ESP32" sortable />
                        <Column field="status" header="Estado" body={statusBodyTemplate} sortable />
                        <Column body={actionBodyTemplate} header="Acciones" style={{ width: '8rem', textAlign: 'center' }} />
                    </DataTable>
                </Card>

                <div className="mt-4 bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <h3 className="text-lg font-semibold text-amber-800 mb-2">Indicadores de Estado</h3>
                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <span className="w-2 h-2 mr-1 rounded-full bg-green-400"></span>
                                activo
                            </span>
                            <span className="text-gray-700">- ESP32 en uso, recolectando naranjas</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                <span className="w-2 h-2 mr-1 rounded-full bg-yellow-400"></span>
                                esperando
                            </span>
                            <span className="text-gray-700">- ESP32 disponible para uso</span>
                        </div>
                    </div>
                </div>
            </div>
        </Dashboard>
    );
}
