import React from "react";
import Navbar from "../components/Navbar";

export default function Dashboard({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col bg-amber-50">
            {/* Navbar fija en la parte superior */}
            <div className="sticky top-0 z-10 w-full shadow-md">
                <Navbar />
            </div>

            {/* Contenedor principal con sidebar y contenido */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar - Opciones básicas */}
                <div className="hidden md:block w-16 bg-white border-r border-amber-200 pt-4">
                    <div className="flex flex-col items-center space-y-6">
                        <a href="/home" className="p-2 rounded-full hover:bg-amber-100 transition-colors">
                            <i className="pi pi-home text-amber-600 text-xl"></i>
                        </a>
                        <a href="/lotes" className="p-2 rounded-full hover:bg-amber-100 transition-colors">
                            <i className="pi pi-list text-amber-600 text-xl"></i>
                        </a>
                        <a href="/dashboard-lotes" className="p-2 rounded-full hover:bg-amber-100 transition-colors">
                            <i className="pi pi-chart-bar text-amber-600 text-xl"></i>
                        </a>
                        <a href="/naranjas" className="p-2 rounded-full hover:bg-amber-100 transition-colors">
                            <i className="pi pi-circle-fill text-amber-600 text-xl"></i>
                        </a>
                    </div>
                </div>

                {/* Área de contenido principal con scroll */}
                <div className="flex-1 overflow-auto p-4">
                    <div
                        className="min-h-full rounded-xl shadow-inner p-4"
                        style={{
                            backgroundImage: "linear-gradient(to bottom, #f3f4f6 80%, #fef3c7 100%)",
                            boxShadow: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)"
                        }}
                    >
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}