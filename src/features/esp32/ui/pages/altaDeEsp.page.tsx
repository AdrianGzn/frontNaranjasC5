import { useEffect, useState, useRef } from "react";
import Dashboard from "../../../../shared/ui/pages/dashboard.component";
import Esp32 from "../../domain/esp32.entity";
import useGetEsps from "../../infrastructure/getEsps.controller";
import useCreateEsps from "../../infrastructure/createEsp32.controller";
import { LoginResponse } from "../../../users/domain/LoginResponse";
import useDeleteEsps from "../../infrastructure/deleteEsp.controller";
import TableViewEsps from "../components/listEsps.component";
import { Button } from "primereact/button";
import useGetEspsId from "../../infrastructure/getEsp32IdController";
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';

export default function AltaDeEsp() {
    const [esps, setEsps] = useState<Esp32[]>([]);
    const [userData, setUserData] = useState<LoginResponse | null>(null);
    const [update, setUpdate] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showConfigDialog, setShowConfigDialog] = useState<boolean>(false);
    const [newEspId, setNewEspId] = useState<string>('');
    const toast = useRef<Toast>(null);

    const { espsResult, consultEspsId } = useGetEspsId();
    const { createEsps } = useCreateEsps();
    const { deleteEsps } = useDeleteEsps();

    const handleCreate = async () => {
        if (!userData?.user) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'No se ha encontrado un usuario para dar de alta la ESP',
                life: 3000
            });
            return;
        }

        let newEsp: Esp32 = {
            id: "",
            id_propietario: userData.user.id,
            status: "esperando" // Agregar estado por defecto
        };

        try {
            setIsLoading(true);
            await createEsps(newEsp);
            setUpdate(prev => !prev);

            // Mostrar toast simplificado
            toast.current?.show({
                severity: 'success',
                summary: 'ESP32 Registrada',
                detail: 'El dispositivo ha sido añadido correctamente',
                life: 3000
            });

            // Mostrar diálogo con instrucciones sin referencia al ID
            setShowConfigDialog(true);
        } catch (error) {
            console.error("Error al crear la esp:", error);

            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo crear la ESP. Inténtelo de nuevo.',
                life: 3000
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (idEsp: string) => {
        try {
            await deleteEsps(idEsp);
            setUpdate(prev => !prev);

            toast.current?.show({
                severity: 'success',
                summary: 'ESP Eliminada',
                detail: `La ESP con ID ${idEsp} ha sido eliminada correctamente`,
                life: 3000
            });
        } catch (error) {
            console.error("Error al eliminar la esp:", error);

            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo eliminar la ESP. Inténtelo de nuevo.',
                life: 3000
            });
        }
    };

    useEffect(() => {
        let dataUserString = localStorage.getItem("dataUserLoged");
        if (dataUserString) {
            let savedDataUser: LoginResponse = JSON.parse(dataUserString);
            setUserData(savedDataUser);
        }
    }, [update]);

    useEffect(() => {
        if (userData?.user) {
            consultEspsId(userData.user.id);
        }
    }, [userData, update]);

    useEffect(() => {
        if (userData?.user?.id) {
            setEsps(espsResult.filter((esp: Esp32) => esp.id_propietario === userData.user?.id));
        } else {
            setEsps([]);
        }
    }, [userData, espsResult]);

    return (
        <div className="w-full h-screen bg-gray-100">
            <Dashboard>
                <Toast ref={toast} />
                <div className="w-full h-full flex flex-col items-center">
                    <div className="w-[95%] h-14 mt-5 flex justify-between items-center px-5 py-3 rounded-lg">
                        <p className="font-semibold text-3xl text-amber-500 tracking-wide">Esps del usuario</p>
                        <Button
                            label="Añadir ESP"
                            icon="pi pi-plus"
                            className="p-button-raised p-button-primary px-4 py-2 text-orange-600 font-semibold"
                            onClick={handleCreate}
                            disabled={isLoading}
                            loading={isLoading}
                        />
                    </div>
                    <TableViewEsps handleDelete={handleDelete} esps={esps} />
                </div>
                <Dialog
                    header="Configuración de su nuevo dispositivo ESP32"
                    visible={showConfigDialog}
                    style={{ width: '500px' }}
                    onHide={() => setShowConfigDialog(false)}
                    footer={
                        <div>
                            <Button
                                label="Entendido"
                                icon="pi pi-check"
                                onClick={() => setShowConfigDialog(false)}
                                autoFocus
                            />
                        </div>
                    }
                >
                    <div className="flex flex-col gap-4">
                        <p className="text-amber-700">
                            <i className="pi pi-info-circle mr-2 text-amber-500 text-xl"></i>
                            Su dispositivo ESP32 ha sido registrado exitosamente.
                        </p>

                        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                            <h3 className="text-lg font-semibold text-amber-800 mb-2">Próximos pasos:</h3>
                            <ol className="list-decimal pl-5 space-y-2">
                                <li>Por favor comuníquese con nuestro departamento técnico para la configuración.</li>
                                <li>Envíe un correo a <span className="font-semibold">soporte@naranjas.com</span> incluyendo su información de contacto.</li>
                                <li>O llame al teléfono <span className="font-semibold">(55) 1234-5678</span> en horario de atención.</li>
                            </ol>
                        </div>

                        <p className="italic text-sm text-amber-600">
                            Es fundamental completar la configuración para que su dispositivo funcione correctamente con nuestro sistema.
                        </p>
                    </div>
                </Dialog>
            </Dashboard>
        </div>
    );
}
