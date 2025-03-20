// import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {Home} from "./presentation/pages/Home.tsx";
import {Login} from "./presentation/pages/Login.tsx";
import { PrimeReactProvider } from 'primereact/api';
import CreateNewCajas from './features/caja/ui/pages/createNewCajas.tsx';
import Lotes from './presentation/pages/Lotes.tsx';

function App() {

  return (
    <Router>
      <PrimeReactProvider>
        <Routes>
            <Route path="/" element={<Login/>} />
            <Route path="/home" element={<Home/>} />
            <Route path='/cajas/create' element={<CreateNewCajas/>}></Route>
            <Route path='/lotes' element={<Lotes/>}></Route>
        </Routes>
      </PrimeReactProvider>
    </Router>
  )
}

export default App
