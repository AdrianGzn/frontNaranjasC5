import React from "react";
import Navbar from "../components/Navbar";

export default function Dashboard ({children}: any) {
    return <div className="w-full h-full flex flex-wrap bg-white">
        <div className="w-full h-[8%]">
            <Navbar />
        </div>
        <div className="w-14 h-[92%] bg-white">
            Mi barra
        </div>
        <div className="flex-1 bg-slate-200 rounded-2xl shadow-inner">
            {children}
        </div>
    </div>
}