// Actualizar el Navbar.tsx para incluir el enlace a Usuarios
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";

export const Navbar = () => {
    const navigate = useNavigate();

    // Obtener usuario del localStorage para verificar permisos
    const userJson = localStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;
    const isOwner = user && user.rol === 'dueño';

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    }

    return (
        <header className="bg-white shadow-sm p-4 w-full">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center">
                    <img
                        src="/logo-naranjas.png"
                        alt="Logo Sistema Naranjas"
                        className="h-20 mr-3"
                    />
                    <h1 className="text-2xl font-bold text-amber-600">Sistema de Naranjas</h1>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="hidden md:block">
                        <ul className="flex space-x-2 items-center">
                            <li>
                                <Button
                                    label="Inicio"
                                    icon="pi pi-home"
                                    className="p-button-outlined p-button-sm"
                                    onClick={() => navigate("/home")}
                                />
                            </li>
                            {/*  Naranjas en websocket */}
                            <li>
                                <Button
                                    label="Naranjas"
                                    icon="pi pi-table"
                                    className="p-button-outlined p-button-sm"
                                    onClick={() => navigate("/naranjas")}
                                />
                            </li>
                            <li>
                                <Button
                                    label="Lotes"
                                    icon="pi pi-list"
                                    className="p-button-outlined p-button-sm"
                                    onClick={() => navigate("/lotes")}
                                />
                            </li>
                            {/* <li>
                                <Button
                                    label="Rendimientos"
                                    icon="pi pi-chart-bar"
                                    className="p-button-outlined p-button-sm"
                                    onClick={() => navigate("/cajas/stadistics")}
                                />
                            </li> */}
                            <li>
                                <Button
                                    label="Dashboard General"
                                    icon="pi pi-chart-line"
                                    className="p-button-outlined"
                                    onClick={() => navigate('/dashboard-lotes')}
                                />
                            </li>
                            {(isOwner || (user && user.rol === 'dueño')) && (
                                <li>
                                    <Button
                                        label="Usuarios"
                                        icon="pi pi-users"
                                        className="p-button-outlined p-button-sm"
                                        onClick={() => navigate("/users")}
                                    />
                                </li>
                            )}
                            {(isOwner || (user && user.rol === 'dueño')) && (
                                <li>
                                    <Button
                                        label="ESP32"
                                        icon="pi pi-th-large"
                                        className="p-button-outlined p-button-sm"
                                        onClick={() => navigate("/esp/alta")}
                                    />
                                </li>
                            )}
                        </ul>
                    </div>
                    <div className="flex space-x-2 items-center">
                        <Button
                            label="Cerrar sesión"
                            icon="pi pi-sign-out"
                            className="p-button-outlined p-button-sm"
                            onClick={handleLogout}
                        />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;