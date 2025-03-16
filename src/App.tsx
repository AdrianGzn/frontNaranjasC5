// import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {Home} from "./presentation/pages/Home.tsx";
import {Login} from "./presentation/pages/Login.tsx";

function App() {

  return (
    <Router>
        <Routes>
            <Route path="/" element={<Login/>} />
            <Route path="/home" element={<Home/>} />
        </Routes>
    </Router>
  )
}

export default App
