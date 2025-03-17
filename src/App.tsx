// import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {Home} from "./presentation/pages/Home.tsx";
import {Login} from "./presentation/pages/Login.tsx";
import CreateNewCajas from './features/caja/ui/pages/createNewCajas.tsx';

function App() {

  return (
    <Router>
        <Routes>
            <Route path="/" element={<Login/>} />
            <Route path="/home" element={<Home/>} />
            <Route path='/cajas/create' element={<CreateNewCajas/>}></Route>
        </Routes>
    </Router>
  )
}

export default App
