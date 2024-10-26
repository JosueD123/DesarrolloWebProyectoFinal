import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UsuarioProvider } from './context/UsuarioContexto';
import Login from './components/Login';
import Registro from './components/Registro';
import AdminCampañas from './components/AdminCampañas';
import Campañas from './components/Campañas';
import DetallesCampania from './components/DetallesCampania';

const App = () => {
    return (
        <UsuarioProvider>
            <Router>
                <div className="container">
                    {/* Eliminé el título aquí para que no aparezca en todas las páginas */}
                    <Routes>
                        {/* Redirigimos a "/login" si se accede a la raíz */}
                        <Route path="/" element={<Navigate to="/login" />} /> 

                        {/* Rutas de Login y Registro */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/registro" element={<Registro />} />

                        {/* Ruta de AdminCampañas */}
                        <Route path="/admin/campanias" element={<AdminCampañas />} />

                        {/* Ruta de listado de campañas */}
                        <Route path="/campanias" element={<Campañas />} />

                        {/* Ruta para ver los detalles de una campaña */}
                        <Route path="/campanias/:id" element={<DetallesCampania />} />
                    </Routes>
                </div>
            </Router>
        </UsuarioProvider>
    );
};

export default App;
