import { createContext, useEffect, useState } from 'react';

export const UsuariosContext = createContext();

export const UsuariosProvider = ({ children }) => {
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        async function carregarUsuarios() {
            try {
                const response = await fetch('http://127.0.0.1:8000/user/todos_usuarios');
                const dados = await response.json();
                setUsuarios(Array.isArray(dados.usuarios) ? dados.usuarios : []);
            } catch (error) {
                console.error('Erro ao carregar usuarios:', error);
                setUsuarios([]);
            }
        }

        carregarUsuarios();
    }, []);

    return (
        <UsuariosContext.Provider value={[usuarios, setUsuarios]}>
            {children}
        </UsuariosContext.Provider>
    )
}
