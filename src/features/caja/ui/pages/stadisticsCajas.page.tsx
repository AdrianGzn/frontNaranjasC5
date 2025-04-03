import { useEffect, useState } from "react";
import useGetByLoteCajas from "../../infrastructure/getByLote.controller";
import useGetLotes from "../../../lote/infrastructure/consult_lotes.controller";
import Lote from "../../../lote/domain/lote.entity";
import Caja from "../../domain/caja.entity";
import Dashboard from "../../../../shared/ui/pages/dashboard.component";
import { LoginResponse } from "../../../users/domain/LoginResponse";
import { User } from "../../../users/domain/user.entity";
import useGetUsers from "../../../users/infrastructure/controllers/getAllUsersController";
import { Chart } from "primereact/chart";
import { AuthService } from "../../../../shared/hooks/auth_user.service";

export default function StadisticsCajas() {
    const [myLotes, setMyLotes] = useState<Lote[]>([]);
    const [userData, setUserData] = useState<LoginResponse | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [chartData, setChartData] = useState<any[]>([]); // Estado para las gráficas

    const { cajasResult, consultCajas } = useGetByLoteCajas();
    const { lotes, consultLotes } = useGetLotes(AuthService.getUserData()?.id || 0);
    const { usersResult, consultUsers } = useGetUsers();

    useEffect(() => {
        let dataUserString = localStorage.getItem("dataUserLoged");
        if (dataUserString) {
            let savedDataUser: LoginResponse = JSON.parse(dataUserString);
            setUserData(savedDataUser);
        } else {
            console.log('No hay usuario logueado');
        }
        consultUsers();
    }, []);

    useEffect(() => {
        if (userData?.user?.id) {
            setUsers(usersResult.filter((item: User) => item.idJefe === userData.user?.id));
        } else {
            console.log('No se pueden filtrar los trabajadores');
        }
    }, [usersResult, userData]);

    // Obtener lotes de los usuarios filtrados
    useEffect(() => {
        consultLotes().then(() => {
            setMyLotes(lotes.filter((item: Lote) => users.some(user => user.id === item.user_id)));
        });
    }, [userData, users]);

    // Obtener cajas de cada lote
    useEffect(() => {
        let tempChartData: any[] = [];

        myLotes.forEach(async (item: Lote) => {
            await consultCajas(item.id);

            if (cajasResult.length > 0) {
                const pesos = cajasResult.map((caja) => caja.peso_total);
                const cantidades = cajasResult.map((caja) => caja.cantidad);

                tempChartData.push({
                    fecha: item.fecha, // Fecha
                    pesos: pesos,
                    cantidades: cantidades
                });
                // Solo setear después de que todos los datos se han procesado
                if (tempChartData.length === myLotes.length) {
                    setChartData([...tempChartData]); // Usar el spread para agregar nuevos elementos al arreglo
                }
            }
        });
    }, [myLotes, cajasResult]);

    
    useEffect(() => {// Simulación de datos de lotes y cajas
        const simulatedLotes: Lote[] = [
            { id: 1, fecha: "2025-03-01", observaciones: "Lote 1", user_id: 1 },
            { id: 2, fecha: "2025-03-02", observaciones: "Lote 2", user_id: 2 },
            { id: 3, fecha: "2025-03-03", observaciones: "Lote 3", user_id: 1 },
            { id: 4, fecha: "2025-03-04", observaciones: "Lote 4", user_id: 3 },
            { id: 5, fecha: "2025-03-05", observaciones: "Lote 5", user_id: 2 },
            { id: 6, fecha: "2025-03-06", observaciones: "Lote 6", user_id: 3 },
            { id: 7, fecha: "2025-03-07", observaciones: "Lote 7", user_id: 1 },
            { id: 8, fecha: "2025-03-08", observaciones: "Lote 8", user_id: 2 },
        ];
        setMyLotes(simulatedLotes);

        const simulatedCajas: Caja[] = [
            { id: 1, descripcion: "Caja A", peso_total: 10, precio: 100, lote_fk: 1, encargado_fk: 1, cantidad: 5, estado: "Nuevo", esp32Fk: "ESP123" },
            { id: 2, descripcion: "Caja B", peso_total: 15, precio: 150, lote_fk: 1, encargado_fk: 1, cantidad: 3, estado: "Nuevo", esp32Fk: "ESP124" },
            { id: 3, descripcion: "Caja C", peso_total: 20, precio: 200, lote_fk: 2, encargado_fk: 2, cantidad: 8, estado: "Usado", esp32Fk: "ESP125" },
            { id: 4, descripcion: "Caja D", peso_total: 25, precio: 250, lote_fk: 3, encargado_fk: 3, cantidad: 10, estado: "Nuevo", esp32Fk: "ESP126" },
            { id: 5, descripcion: "Caja E", peso_total: 30, precio: 300, lote_fk: 4, encargado_fk: 1, cantidad: 12, estado: "Usado", esp32Fk: "ESP127" },
            { id: 6, descripcion: "Caja F", peso_total: 35, precio: 350, lote_fk: 5, encargado_fk: 2, cantidad: 15, estado: "Nuevo", esp32Fk: "ESP128" },
            { id: 7, descripcion: "Caja G", peso_total: 40, precio: 400, lote_fk: 6, encargado_fk: 3, cantidad: 18, estado: "Usado", esp32Fk: "ESP129" },
            { id: 8, descripcion: "Caja H", peso_total: 45, precio: 450, lote_fk: 7, encargado_fk: 1, cantidad: 20, estado: "Nuevo", esp32Fk: "ESP130" }
        ];

        const simulatedChartData = simulatedLotes.map(lote => {
            const cajasParaLote = simulatedCajas.filter(caja => caja.lote_fk === lote.id);
            const pesos = cajasParaLote.map(caja => caja.peso_total);
            const cantidades = cajasParaLote.map(caja => caja.cantidad);
            return {
                fecha: lote.fecha,
                pesos: pesos,
                cantidades: cantidades
            };
        });

        setChartData(simulatedChartData);
    }, [])

    return (
        <div className="w-full h-screen">
            <Dashboard>
                <div className="w-full h-full flex flex-col items-center">
                    <div className="w-[95%] h-full m-5 flex flex-col items-center bg-white p-5 rounded-xl">
                        <h3>Gráficas de Cajas por Lote</h3>
                        <div className="w-full h-full flex flex-wrap justify-between overflow-y-scroll" style={{ maxHeight: "70vh" }}>
                            {chartData.length > 0 ? (
                                chartData.map((data, index) => (
                                    <div key={index} className="w-[45%] h-64 p-4 mb-4 flex flex-col items-center">
                                        <h4>Lote: {new Date(data.fecha).toLocaleDateString()}</h4>
                                        <Chart
                                            type="bar"
                                            data={{
                                                labels: data.pesos.map(() => "Caja"), // Etiquetas de cada caja
                                                datasets: [
                                                    {
                                                        label: 'Peso Total',
                                                        data: data.pesos,
                                                        backgroundColor: '#42A5F5',
                                                        borderColor: '#1E88E5',
                                                        borderWidth: 1
                                                    },
                                                    {
                                                        label: 'Cantidad de Cajas',
                                                        data: data.cantidades,
                                                        backgroundColor: '#66BB6A',
                                                        borderColor: '#43A047',
                                                        borderWidth: 1
                                                    }
                                                ]
                                            }}
                                        />
                                    </div>
                                ))
                            ) : (
                                <p>No hay datos disponibles.</p>
                            )}
                        </div>
                    </div>
                </div>
            </Dashboard>
        </div>
    );
}
