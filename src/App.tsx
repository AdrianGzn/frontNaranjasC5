// import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from "./presentation/pages/Home.tsx";
import { Login } from "./presentation/pages/Login.tsx";
import { PrimeReactProvider } from 'primereact/api';


function App() {

  return (
    <Router>
      <PrimeReactProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </PrimeReactProvider>
    </Router>
  )
}

export default App
