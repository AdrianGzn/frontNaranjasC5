import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import Navbar from "../../shared/ui/components/Navbar";
import useGetEspsId from "../../features/esp32/infrastructure/getEsp32IdController";
import { AuthService } from "../../shared/hooks/auth_user.service";
import { useEffect, useState, useMemo } from "react";
import Esp32 from "../../features/esp32/domain/esp32.entity";
import { useWebSocket } from "../../shared/hooks/websocket.provider";
import { useNaranjasStore } from "../../data/naranjaStore";
import useGetLotes from "../../features/lote/infrastructure/consult_lotes.controller";
import Lote from "../../features/lote/domain/lote.entity";

export const Home = () => {
    const navigate = useNavigate();
    const { addConnection } = useWebSocket();
    const [esp32, setEsp32] = useState<Esp32[]>([]);
    const { addNaranja, naranjasStore } = useNaranjasStore();
    const { consultLotes, lotes } = useGetLotes(AuthService.getUserData()?.id || 0);
    const [lotesUser, setLotesUser] = useState<Lote[]>([]);
    const userJson = localStorage.getItem('user');
    const user = useMemo(() => userJson ? JSON.parse(userJson) : null, [userJson]);
    const isOwner = user && user.rol === 'dueño';
    const { espsResult, consultEspsId } = useGetEspsId();
    const [esp32Length, setEsp32Length] = useState<number>(0);

    // Single initialization effect
    useEffect(() => {
        console.log("esp32", esp32)
        // Initialize data
        const initializeData = async () => {
            if (user?.id) {
                await consultEspsId(user.id);
                await consultLotes();
            }
        };

        // Initialize WebSocket
        const socket = addConnection("ws://52.4.21.111:8085/naranjas/");

        socket.onopen = () => {
            console.log("Connected to naranjas WebSocket");
        };

        socket.onmessage = (message: MessageEvent) => {
            try {
                const naranja = JSON.parse(message.data);
                if (naranja.id && naranja.peso && naranja.caja_fk) {
                    addNaranja(naranja);
                }
            } catch (error) {
                console.error("Error processing WebSocket message:", error);
            }
        };

        initializeData();

        // Cleanup
        return () => {
            socket.close();
            console.log("WebSocket connection closed");
        };
    }, []); // Empty dependency array for initialization

    // Handle ESP32 data updates
    useEffect(() => {
        if (espsResult) {
            setEsp32(espsResult);
            // Contar solo ESP32 activas
            setEsp32Length(espsResult.filter(esp => esp.status === 'activo').length);
        }
    }, [espsResult]);

    // Handle lotes updates
    useEffect(() => {
        if (lotes && user) {
            const filteredLotes = lotes.filter(
                (item: Lote) => item.user_id === user.id
            );
            setLotesUser(filteredLotes);
        }
    }, [lotes, user]);

    return (
        <div className="min-h-screen flex flex-col bg-amber-50">
            <Navbar />
            <section className="bg-gradient-to-r from-amber-500 to-amber-400 text-white py-16">
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 mb-8 md:mb-0">
                        <h2 className="text-4xl font-bold mb-4">Bienvenido al Sistema de Gestión de Naranjas</h2>
                        <p className="text-xl mb-6">Administra tus cosechas, controla la recolección y optimiza la producción de cítricos.</p>
                        <Button
                            label="Comenzar"
                            icon="pi pi-arrow-right"
                            className="p-button-lg"
                            onClick={() => { navigate("/cajas/create") }}
                        />
                    </div>
                    <div className="md:w-1/2 flex justify-center">
                        <img
                            src="/naranjas.png"
                            alt="Ilustración de naranjas"
                            style={{ width: "350px", height: "350px" }}

                        />
                    </div>
                </div>
            </section>

            <section className="py-12 container mx-auto px-4 text-center">
                <h3 className="text-2xl font-semibold text-amber-800 mb-8">Accesos Rápidos</h3>

                <div className=" gap-6 flex justify-center items-center">
                    {(isOwner || (user && user.rol === 'dueño')) && (
                        <Card className="shadow-md hover:shadow-lg transition-shadow border border-amber-200">
                            <div className="flex flex-col items-center text-center p-4">
                                <i className="pi pi-calendar text-5xl text-amber-500 mb-4"></i>
                                <h4 className="text-xl font-semibold text-amber-800 mb-2">Programar Recolección</h4>
                                <p className="text-amber-700 mb-4">Organiza las actividades de recolección y asigna personal</p>
                                <Button
                                    label="Ir a Programación"
                                    className="p-button-outlined"
                                    onClick={() => { navigate("/") }}
                                />
                            </div>
                        </Card>
                    )}

                    <Card className="shadow-md hover:shadow-lg transition-shadow border border-amber-200">
                        <div className="flex flex-col items-center text-center p-4">
                            <i className="pi pi-chart-bar text-5xl text-amber-500 mb-4"></i>
                            <h4 className="text-xl font-semibold text-amber-800 mb-2">Estadísticas</h4>
                            <p className="text-amber-700 mb-4">Visualiza los datos de producción y rendimiento de cosechas</p>
                            <Button
                                label="Ver Estadísticas"
                                className="p-button-outlined"
                                onClick={() => { navigate("/dashboard-lotes") }}
                            />
                        </div>
                    </Card>

                    {(isOwner || (user && user.rol === 'dueño')) && (
                        <Card className="shadow-md hover:shadow-lg transition-shadow border border-amber-200">
                            <div className="flex flex-col items-center text-center p-4">
                                <i className="pi pi-users text-5xl text-amber-500 mb-4"></i>
                                <h4 className="text-xl font-semibold text-amber-800 mb-2">Gestionar Personal</h4>
                                <p className="text-amber-700 mb-4">Administra recolectores y supervisores del sistema</p>
                                <Button
                                    label="Gestión de Usuarios"
                                    className="p-button-outlined"
                                    onClick={() => { navigate("/users") }}
                                />
                            </div>
                        </Card>
                    )}
                </div>
            </section>

            <section className="bg-amber-100 py-10">
                <div className="container mx-auto px-4 text-center">
                    <h3 className="text-2xl font-semibold text-amber-800 mb-8">Resumen del Sistema</h3>

                    <div className=" gap-4 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="text-4xl font-bold text-amber-500 mb-2">{lotesUser.length}</div>
                            <div className="text-amber-800">Lotes en existencia: </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="text-4xl font-bold text-amber-500 mb-2">{esp32Length}</div>
                            <div className="text-amber-800">Recolectores Activos</div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="text-4xl font-bold text-amber-500 mb-2">{naranjasStore.length}</div>
                            <div className="text-amber-800">Naranjas totales: </div>
                        </div>

                    </div>
                </div>
            </section>


            {/* Footer */}
            <footer className="bg-amber-800 text-white py-8 mt-auto">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0">
                            <h4 className="text-xl font-semibold mb-2">Sistema de Naranjas</h4>
                            <p>La solución completa para la gestión de cultivos cítricos</p>
                        </div>
                        <div className="text-center mb-4 md:mb-0">
                            <p>&copy; 2023 Sistema de Naranjas - Todos los derechos reservados</p>
                        </div>
                        <div className="flex space-x-4">
                            <Button icon="pi pi-question-circle" className="p-button-rounded p-button-text p-button-sm" />
                            <Button icon="pi pi-cog" className="p-button-rounded p-button-text p-button-sm" />
                            <Button icon="pi pi-bell" className="p-button-rounded p-button-text p-button-sm" />
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};