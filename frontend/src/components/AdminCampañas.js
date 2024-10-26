import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import './AdminCampañas.css';

const AdminCampañas = () => {
    const [campanias, setCampanias] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarModalCandidatos, setMostrarModalCandidatos] = useState(false);
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [estado, setEstado] = useState('deshabilitada');
    const [candidato, setCandidato] = useState('');
    const [listaCandidatos, setListaCandidatos] = useState([]);
    const [campaniaSeleccionada, setCampaniaSeleccionada] = useState(null);

    // Función para obtener las campañas desde el backend
    const obtenerCampanias = async () => {
        const respuesta = await axios.get('http://localhost:5000/admin/campanias');
        setCampanias(respuesta.data);
    };

    // Función para crear una nueva campaña
    const crearCampania = async (e) => {
        e.preventDefault();
        await axios.post('http://localhost:5000/admin/campanias', { titulo, descripcion, estado });
        setTitulo('');
        setDescripcion('');
        setEstado('deshabilitada');
        obtenerCampanias(); // Actualiza la lista de campañas después de la creación
        setMostrarModal(false); // Cierra el modal después de crear la campaña
    };

    // Función para cambiar el estado de la campaña
    const cambiarEstado = async (id, estadoActual) => {
        const nuevoEstado = estadoActual === 'habilitada' ? 'deshabilitada' : 'habilitada';
        await axios.put(`http://localhost:5000/admin/campanias/${id}/estado`, { estado: nuevoEstado });
        obtenerCampanias(); // Refrescar la lista de campañas
        window.location.reload();

    };

    // Función para cerrar votación
    const cerrarVotacion = async (id) => {
        await axios.put(`http://localhost:5000/admin/campanias/${id}/estado`, { estado: 'deshabilitada' });
        obtenerCampanias(); // Refrescar la lista de campañas
    };

    const agregarCandidato = () => {
        if (candidato.trim() !== '') {
            setListaCandidatos([...listaCandidatos, { id: Date.now(), nombre: candidato, votos: 0 }]);
            setCandidato(''); // Limpiar el campo de texto
        }
    };

    // Función para eliminar un candidato de la lista temporal
    const eliminarCandidato = (index) => {
        const nuevaLista = [...listaCandidatos];
        nuevaLista.splice(index, 1);
        setListaCandidatos(nuevaLista);
    };

    // Función para abrir el modal de candidatos y seleccionar la campaña
    const abrirModalCandidatos = (campania) => {
        setCampaniaSeleccionada(campania);
        setMostrarModalCandidatos(true);
    };

    // Función para asignar candidatos a la campaña seleccionada
    const asignarCandidatos = async () => {
        await axios.post(`http://localhost:5000/admin/campanias/${campaniaSeleccionada.id}/candidatos`, { candidatos: listaCandidatos });
        obtenerCampanias(); // Refrescar la lista de campañas
        setMostrarModalCandidatos(false); // Cerrar el modal de asignación de candidatos
        setListaCandidatos([]); // Limpiar la lista de candidatos
        window.location.reload();

    };

    useEffect(() => {
        obtenerCampanias();
    }, []);

    return (
        <div className="admin-campanias-container">
            <h2 className="titulo-principal">Campañas</h2>
            <div className="campanias-grid">
                {campanias.map((campania) => (
                    <div
                        key={campania.id}
                        className={`campania-card ${campania.estado === 'deshabilitada' ? 'campania-deshabilitada' : ''}`}
                    >
                        <h3>{campania.titulo}</h3>
                        <p>{campania.descripcion}</p>
                        <p><strong>Estado:</strong> {campania.estado === 'habilitada' ? 'habilitada' : 'deshabilitada'}</p>

                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={campania.estado === 'habilitada'}
                                onChange={() => cambiarEstado(campania.id, campania.estado)}
                            />
                            <span className="slider"></span>
                        </label>

                        {/* Botón de cerrar votación */}
                        <Button
                            variant="warning"
                            onClick={() => cerrarVotacion(campania.id)}
                            disabled={campania.estado === 'deshabilitada'}
                        >
                            Cerrar votación
                        </Button>

                        {/* Botón para agregar candidatos */}
                        <Button
                            variant="primary"
                            onClick={() => abrirModalCandidatos(campania)}
                        >
                            Agregar candidatos
                        </Button>

                        {/* Mostrar candidatos asignados */}
                        <ul>
                            {campania.candidatos && campania.candidatos.map((candidato, index) => (
                                <li key={index}>
                                    {candidato.nombre} - Votos: {candidato.votos}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}

                {/* Tarjeta para crear nueva campaña */}
                <div className="campania-card nueva-campania" onClick={() => setMostrarModal(true)}>
                    <div className="icono-mas">+</div>
                    <p>Crear nueva campaña</p>
                </div>
            </div>

            {/* Modal para crear una nueva campaña */}
            <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Crear Nueva Campaña</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={crearCampania}>
                        <Form.Group className="mb-3">
                            <Form.Label>Título de la Campaña</Form.Label>
                            <Form.Control
                                type="text"
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Descripción de la Campaña</Form.Label>
                            <Form.Control
                                as="textarea"
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Estado de la Campaña</Form.Label>
                            <Form.Select
                                value={estado}
                                onChange={(e) => setEstado(e.target.value)}
                                required
                            >
                                <option value="habilitada">Habilitada</option>
                                <option value="deshabilitada">Deshabilitada</option>
                            </Form.Select>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Crear Campaña
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setMostrarModal(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal para agregar candidatos */}
            <Modal show={mostrarModalCandidatos} onHide={() => setMostrarModalCandidatos(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Agregar Candidatos</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="text"
                            placeholder="Nombre del candidato"
                            value={candidato}
                            onChange={(e) => setCandidato(e.target.value)}
                        />
                    </Form.Group>
                    <Button variant="primary" onClick={agregarCandidato}>
                        Agregar candidato
                    </Button>

                    {/* Lista de candidatos agregados */}
                    <ul>
                        {listaCandidatos.map((candidato, index) => (
                            <li key={index}>
                                {candidato.nombre}
                                <Button variant="danger" onClick={() => eliminarCandidato(index)}>Eliminar</Button>
                            </li>
                        ))}
                    </ul>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={asignarCandidatos} >
                        Asignar candidatos
                    </Button>
                    <Button variant="secondary" onClick={() => setMostrarModalCandidatos(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
        
    );
    window.location.reload();

    
};

export default AdminCampañas;
