import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';  // Importamos Link para crear enlaces a las rutas

const Campañas = () => {
    const [campanias, setCampanias] = useState([]);

    useEffect(() => {
        const obtenerCampanias = async () => {
            try {
                const respuesta = await axios.get('http://localhost:5000/admin/campanias'); // Cambié la URL
                setCampanias(respuesta.data);
            } catch (error) {
                console.error("Error al obtener campañas", error);
            }
        };
        obtenerCampanias();
    }, []);
    
    

    return (
        <div className="campanias-lista">
            <h2 className="titulo-principal">Campañas Disponibles</h2>
            <div className="campanias-grid">
                {campanias.map((campania) => (
                    <div 
                        key={campania.id} 
                        className={`campania-card ${campania.estado === 'deshabilitada' ? 'campania-deshabilitada' : ''}`}
                    >
                        <h3>{campania.titulo}</h3>
                        <p>{campania.descripcion}</p>
                        <p><strong>Estado:</strong> {campania.estado === 'habilitada' ? 'Habilitada para votar' : 'No habilitada para votar'}</p>
                        
                        {/* Utilizamos Link para navegar a los detalles de la campaña */}
                        <Link to={`/campanias/${campania.id}`}>
                            Ver detalles
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Campañas;
