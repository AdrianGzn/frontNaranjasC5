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

export default function AltaDeEsp() {
    const [esps, setEsps] = useState<Esp32[]>([]);
    const [userData, setUserData] = useState<LoginResponse | null>(null);
    const [update, setUpdate] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
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

        let newEsp: Esp32 = { id: "", id_propietario: userData.user.id };

        try {
            setIsLoading(true);
            const result = await createEsps(newEsp);
            setUpdate(prev => !prev);

            toast.current?.show({
                severity: 'success',
                summary: 'ESP Creada',
                detail: 'La ESP ha sido añadida correctamente',
                life: 3000
            });
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
            </Dashboard>
        </div>
    );
}
