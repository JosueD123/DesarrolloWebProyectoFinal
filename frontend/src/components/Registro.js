import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import './Registro.css'; // Asegúrate de importar el CSS

const Registro = () => {
    const [numeroColegiado, setNumeroColegiado] = useState('');
    const [nombre, setNombre] = useState('');
    const [dpi, setDPI] = useState('');
    const [email, setEmail] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');
    const [mostrarModal, setMostrarModal] = useState(false);
    const navigate = useNavigate();

    const manejarSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/register', { 
                numeroColegiado, 
                nombre, 
                email, 
                dpi, 
                fechaNacimiento, 
                contrasena 
            });
            setMostrarModal(true); // Mostrar modal de éxito
            setNumeroColegiado('');
            setNombre('');
            setDPI('');
            setEmail('');
            setFechaNacimiento('');
            setContrasena('');
        } catch (err) {
            setError(err.response.data.error || 'Error en el registro');
        }
    };

    const cerrarModal = () => {
        setMostrarModal(false);
        navigate('/login'); // Redirigir a Login después del registro
    };

    return (
        <div className="registro-container">
            <div className="registro-card">
                <h2>Registro de Votantes</h2>
                {error && <p className="text-danger">{error}</p>}
                <form onSubmit={manejarSubmit}>
                    <div className="mb-3">
                        <label>Número de Colegiado</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            value={numeroColegiado} 
                            onChange={(e) => setNumeroColegiado(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="mb-3">
                        <label>Nombre Completo</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            value={nombre} 
                            onChange={(e) => setNombre(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="mb-3">
                        <label>DPI</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            value={dpi} 
                            onChange={(e) => setDPI(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="mb-3">
                        <label>Correo Electrónico</label>
                        <input 
                            type="email" 
                            className="form-control" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="mb-3">
                        <label>Fecha de Nacimiento</label>
                        <input 
                            type="date" 
                            className="form-control" 
                            value={fechaNacimiento} 
                            onChange={(e) => setFechaNacimiento(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="mb-3">
                        <label>Contraseña</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            value={contrasena} 
                            onChange={(e) => setContrasena(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Registrarse</button>
                    <br>
                    </br>
                    <a href="/login" className="btn-link">¿Ya tienes cuenta? Inicia sesión aquí</a>
                </form>
            </div>

            {/* Modal de confirmación */}
            <Modal show={mostrarModal} onHide={cerrarModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Registro Exitoso</Modal.Title>
                </Modal.Header>
                <Modal.Body>¡Te has registrado correctamente!</Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-secondary" onClick={cerrarModal}>
                        Cerrar
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Registro;
