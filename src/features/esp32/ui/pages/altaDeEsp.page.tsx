import { useEffect, useState } from "react";
import Dashboard from "../../../../shared/ui/pages/dashboard.component";
import Esp32 from "../../domain/esp32.entity";
import useGetEsps from "../../infrastructure/getEsps.controller";
import useCreateEsps from "../../infrastructure/createEsp32.controller";
import { LoginResponse } from "../../../users/domain/LoginResponse";
import useDeleteEsps from "../../infrastructure/deleteEsp.controller";
import TableViewEsps from "../components/listEsps.component";
import { Button } from "primereact/button";
import useGetEspsId from "../../infrastructure/getEsp32IdController";

export default function AltaDeEsp() {
    const [esps, setEsps] = useState<Esp32[]>([]);
    const [userData, setUserData] = useState<LoginResponse | null>(null);
    const [update, setUpdate] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false); // Nuevo estado para deshabilitar el botón

    const { espsResult, consultEspsId } = useGetEspsId();
    const { createEsps } = useCreateEsps();
    const { deleteEsps } = useDeleteEsps();

    const handleCreate = async () => {
        if (!userData?.user) {
            console.log("No se ha encontrado un usuario para dar de alta la esp");
            return;
        }

        let newEsp: Esp32 = { id: "", id_propietario: userData.user.id };
        
        try {
            setIsLoading(true); // Activar loading
            await createEsps(newEsp);
            setUpdate(prev => !prev);
        } catch (error) {
            console.error("Error al crear la esp:", error);
        } finally {
            setIsLoading(false); // Desactivar loading
        }
    };

    const handleDelete = async (idEsp: string) => {
        try {
            await deleteEsps(idEsp);
            setUpdate(prev => !prev);
        } catch (error) {
            console.error("Error al eliminar la esp:", error);
        }
    };

    useEffect(() => {
        let dataUserString = localStorage.getItem("dataUserLoged");
        console.log("use")
        if (dataUserString) {
            let savedDataUser: LoginResponse = JSON.parse(dataUserString);
            setUserData(savedDataUser);
        }
    }, [update]);

    useEffect(() => {
        if (userData?.user) {
            consultEspsId(userData.user.id);
            console.log("esp32 result", espsResult)
        }
    }, [userData, update]);

    useEffect(() => {
        if (userData?.user?.id && espsResult.length > 0) {
            setEsps(espsResult.filter((esp: Esp32) => esp.id_propietario === userData.user?.id));
        } else {
            console.log("No hay usuario o datos en el arreglo de esps");
        }
    }, [userData, update]);

    return (
        <div className="w-full h-screen bg-gray-100">
            <Dashboard>
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
                    <TableViewEsps handleDelete={handleDelete} esps={espsResult} />
                </div>
            </Dashboard>
        </div>
    );
}
