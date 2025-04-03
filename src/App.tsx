// import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {Home} from "./presentation/pages/Home.tsx";
import {Login} from "./presentation/pages/Login.tsx";
import { PrimeReactProvider } from 'primereact/api';
import CreateNewCajas from './features/caja/ui/pages/createNewCajas.tsx';
import Lotes from './presentation/pages/Lotes.tsx';
import { ProtectedRoute } from './shared/userContext.tsx';
import Users from './presentation/pages/Users.tsx';
import AltaDeEsp from './features/esp32/ui/pages/altaDeEsp.page.tsx';
import StadisticsCajas from './features/caja/ui/pages/stadisticsCajas.page.tsx';

function App() {

  return (
    <Router>
      <PrimeReactProvider>
        <Routes>
            <Route path="/" element={<Login/>} />
            <Route path="/home" element={<Home/>} />
            <Route path='/cajas/create' element={<CreateNewCajas/>}></Route>
            <Route path='/cajas/stadistics' element={<StadisticsCajas/>}></Route>
            <Route path='/lotes' element={<Lotes/>}></Route>
            <Route path='/esp/alta' element={<AltaDeEsp/>}></Route>
            <Route element={<ProtectedRoute allowedRoles={['dueño']} />}>
              <Route path='/users' element={<Users/>} />
            </Route>
        </Routes>
      </PrimeReactProvider>
    </Router>
  )
}

export default App
