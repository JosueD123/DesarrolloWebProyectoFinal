import React, { createContext, useState } from 'react';

export const UsuarioContexto = createContext();

export const UsuarioProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(null);

    const iniciarSesion = (datosUsuario) => {
        setUsuario(datosUsuario);
    };

    const cerrarSesion = () => {
        setUsuario(null);
    };

    return (
        <UsuarioContexto.Provider value={{ usuario, iniciarSesion, cerrarSesion }}>
            {children}
        </UsuarioContexto.Provider>
    );
};
