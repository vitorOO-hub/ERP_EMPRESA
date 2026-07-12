import { createContext, useCallback, useEffect, useState } from 'react'

export const UsuariosContext = createContext()

export const UsuariosProvider = ({ children }) => {
  const [usuarios, setUsuarios] = useState([])

  const carregarUsuarios = useCallback(async () => {
    const token = localStorage.getItem('access_token')

    if (!token) {
      setUsuarios([])
      return
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/user/todos_usuarios', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('access_token')
        }
        setUsuarios([])
        return
      }

      const dados = await response.json()
      setUsuarios(Array.isArray(dados.usuarios) ? dados.usuarios : [])
    } catch (error) {
      console.error('Erro ao carregar usuarios:', error)
      setUsuarios([])
    }
  }, [])

  useEffect(() => {
    carregarUsuarios()
  }, [carregarUsuarios])

  return (
    <UsuariosContext.Provider value={{ usuarios, setUsuarios, carregarUsuarios }}>
      {children}
    </UsuariosContext.Provider>
  )
}
