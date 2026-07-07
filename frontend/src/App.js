import React from 'react';
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import Ventas from './pages/Ventas';
import Inventario from './pages/Inventario';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <nav className="sidebar">
          <h2>SISDROG</h2>
          <ul>
            <li>
              <Link to="/ventas">Ventas</Link>
            </li>
            <li>
              <Link to="/inventario">Inventario</Link>
            </li>
          </ul>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/ventas" element={<Ventas />} />
            <Route path="/inventario" element={<Inventario />} />
            <Route path="/" element={<Ventas />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
