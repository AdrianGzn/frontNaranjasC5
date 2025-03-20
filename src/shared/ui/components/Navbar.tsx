import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";

export const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    }

    return (
        <header className="bg-white shadow-sm p-4 w-full">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center">
                    <img
                        src="/logo-naranja.png"
                        alt="Logo Sistema Naranjas"
                        className="h-10 mr-3"
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
                            <li>
                                <Button
                                    label="Cajas"
                                    icon="pi pi-box"
                                    className="p-button-outlined p-button-sm"
                                    onClick={() => navigate("/cajas/create")}
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
                        </ul>
                    </div>
                    <div className="flex space-x-2 items-center">
                        <Button
                            label="Cerrar sesión"
                            icon="pi pi-sign-out"
                            className="p-button-outlined p-button-sm"
                            onClick={() => navigate("/")}
                        />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;