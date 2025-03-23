import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import Navbar from "../../shared/ui/components/Navbar";

export const Home = () => {
    
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
                            onClick={() => {/* Navegar a la sección principal */}}
                        />
                    </div>
                    <div className="md:w-1/2 flex justify-center">
                        <img 
                            src="/orange-illustration.png" 
                            alt="Ilustración de naranjas" 
                            className="max-w-md rounded-lg shadow-lg"
                            // Reemplaza con una imagen de naranjas real
                        />
                    </div>
                </div>
            </section>

            <section className="py-12 container mx-auto px-4">
                <h3 className="text-2xl font-semibold text-amber-800 mb-8 text-center">Accesos Rápidos</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="shadow-md hover:shadow-lg transition-shadow border border-amber-200">
                        <div className="flex flex-col items-center text-center p-4">
                            <i className="pi pi-calendar text-5xl text-amber-500 mb-4"></i>
                            <h4 className="text-xl font-semibold text-amber-800 mb-2">Programar Recolección</h4>
                            <p className="text-amber-700 mb-4">Organiza las actividades de recolección y asigna personal</p>
                            <Button 
                                label="Ir a Programación" 
                                className="p-button-outlined" 
                                onClick={() => {/* Navegar */}}
                            />
                        </div>
                    </Card>
                    
                    <Card className="shadow-md hover:shadow-lg transition-shadow border border-amber-200">
                        <div className="flex flex-col items-center text-center p-4">
                            <i className="pi pi-chart-bar text-5xl text-amber-500 mb-4"></i>
                            <h4 className="text-xl font-semibold text-amber-800 mb-2">Estadísticas</h4>
                            <p className="text-amber-700 mb-4">Visualiza los datos de producción y rendimiento de cosechas</p>
                            <Button 
                                label="Ver Estadísticas" 
                                className="p-button-outlined" 
                                onClick={() => {/* Navegar */}}
                            />
                        </div>
                    </Card>
                    
                    <Card className="shadow-md hover:shadow-lg transition-shadow border border-amber-200">
                        <div className="flex flex-col items-center text-center p-4">
                            <i className="pi pi-users text-5xl text-amber-500 mb-4"></i>
                            <h4 className="text-xl font-semibold text-amber-800 mb-2">Gestionar Personal</h4>
                            <p className="text-amber-700 mb-4">Administra recolectores y supervisores del sistema</p>
                            <Button 
                                label="Gestión de Usuarios" 
                                className="p-button-outlined" 
                                onClick={() => {/* Navegar */}}
                            />
                        </div>
                    </Card>
                </div>
            </section>

            {/* Stats or summary */}
            <section className="bg-amber-100 py-10">
                <div className="container mx-auto px-4">
                    <h3 className="text-2xl font-semibold text-amber-800 mb-8 text-center">Resumen del Sistema</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="text-4xl font-bold text-amber-500 mb-2">152</div>
                            <div className="text-amber-800">Árboles Registrados</div>
                        </div>
                        
                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="text-4xl font-bold text-amber-500 mb-2">6</div>
                            <div className="text-amber-800">Recolecciones Programadas</div>
                        </div>
                        
                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="text-4xl font-bold text-amber-500 mb-2">1,240kg</div>
                            <div className="text-amber-800">Cosecha Estimada</div>
                        </div>
                        
                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="text-4xl font-bold text-amber-500 mb-2">8</div>
                            <div className="text-amber-800">Recolectores Activos</div>
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