import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Chart from 'chart.js/auto';
import './DetallesCampania.css'; // Asegúrate de tener un archivo CSS personalizado

const DetallesCampania = () => {
    const { id } = useParams();
    const [campania, setCampania] = useState(null);
    const [candidatos, setCandidatos] = useState([]);
    const [chartInstance, setChartInstance] = useState(null);

    const obtenerDetalles = async () => {
        try {
            const respuesta = await axios.get(`http://localhost:5000/admin/campanias/${id}`);
            setCampania(respuesta.data);
            setCandidatos(respuesta.data.candidatos);
        } catch (error) {
            console.error('Error al obtener los detalles de la campaña', error);
        }
    };

    const emitirVoto = async (candidatoId) => {
        try {
            await axios.post(`http://localhost:5000/votantes/campanias/${id}/votar`, { candidatoId });
            obtenerDetalles();
        } catch (error) {
            console.error('Error al emitir el voto:', error);
        }
    };

    useEffect(() => {
        if (campania && candidatos.length > 0) {
            const ctx = document.getElementById('graficoVotos').getContext('2d');

            if (chartInstance) {
                chartInstance.destroy();
            }

            const newChartInstance = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: candidatos.map((c) => c.nombre),
                    datasets: [
                        {
                            label: 'Votos',
                            data: candidatos.map((c) => c.votos),
                            backgroundColor: '#2980B9',
                        },
                    ],
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                },
            });

            setChartInstance(newChartInstance);
        }
    }, [campania, candidatos]);

    useEffect(() => {
        obtenerDetalles();
    }, [id]);

    return (
        <div className="detalles-campania">
            {campania && (
                <>
                    <h1 className="titulo-campania">{campania.titulo}</h1>
                    <p className="descripcion-campania">{campania.descripcion}</p>
                    <p>
                        <strong>Estado:</strong> {campania.estado === 'habilitada' ? 'Votación activa' : 'Votación no disponible'}
                    </p>

                    <div className="grafico-contenedor">
                        <canvas id="graficoVotos"></canvas>
                    </div>

                    <div className="candidatos-lista">
                        {candidatos.map((candidato) => (
                            <div key={candidato.id} className="candidato-card">
                                <img src={`/imagenes/candidatos/${candidato.nombre}.jpg`} alt={candidato.nombre} className="candidato-img" />
                                <h3>{candidato.nombre}</h3>
                                <p>{candidato.descripcion}</p>
                                <button
                                    className="btn-votar"
                                    onClick={() => emitirVoto(candidato.id)}
                                    disabled={campania.estado !== 'habilitada'}
                                >
                                    Votar
                                </button>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default DetallesCampania;
