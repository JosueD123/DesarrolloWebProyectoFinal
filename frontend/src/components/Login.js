import React, { useContext, useState } from 'react';
import { UsuarioContexto } from '../context/UsuarioContexto';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import './Login.css'; // Importar el archivo de estilos

const Login = () => {
    const { iniciarSesion } = useContext(UsuarioContexto);
    const [numeroColegiado, setNumeroColegiado] = useState('');
    const [dpi, setDPI] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');
    const [mostrarModal, setMostrarModal] = useState(false);
    const navigate = useNavigate();

    const manejarSubmit = async (e) => {
        e.preventDefault();
        try {
            const respuesta = await axios.post('http://localhost:5000/login', { 
                numeroColegiado, 
                dpi, 
                fechaNacimiento, 
                contrasena 
            });
            iniciarSesion(respuesta.data.votante);
            setNumeroColegiado('');
            setDPI('');
            setFechaNacimiento('');
            setContrasena('');
            setError('');
            setMostrarModal(true);
        } catch (err) {
            setError('Credenciales incorrectas');
        }
    };

    const cerrarModal = () => {
        setMostrarModal(false);
        navigate('/'); // Redirigir a la página principal
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Iniciar Sesión</h2>
                <div className='login-image'>
                    <img src="https://borlabs.io/wp-content/uploads/2019/09/blog-wp-login.png" alt="Login" className="login-image" />
                </div>
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
                    <div className="d-flex justify-content-between">
                        <button type="submit" className="btn btn-primary flex-grow-1 me-2">Iniciar Sesión</button>
                        <button 
                            type="button" 
                            className="btn btn-primary flex-grow-1" 
                            onClick={() => navigate('/registro')}
                        >
                            Registrarme
                        </button>
                    </div>
                </form>
            </div>

            {/* Modal de confirmación */}
            <Modal show={mostrarModal} onHide={cerrarModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Inicio de Sesión Exitoso</Modal.Title>
                </Modal.Header>
                <Modal.Body>¡Has iniciado sesión correctamente!</Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-secondary" onClick={cerrarModal}>
                        Cerrar
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Login;
