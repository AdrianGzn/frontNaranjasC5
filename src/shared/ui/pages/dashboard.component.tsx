import React from "react";
import Navbar from "../components/Navbar";

export default function Dashboard ({children}: any) {
    return <div className="w-full h-full flex flex-wrap bg-white">
        <div className="w-full h-[8%]">
            <Navbar />
        </div>
        <div 
            className="flex-1 rounded-2xl shadow-inner"
            style={{ backgroundImage: "linear-gradient(to bottom, #e2e8f0 60%, oklch(0.954 0.038 75.164) 100%)" }}
        >
            {children}
        </div>
    </div>
}