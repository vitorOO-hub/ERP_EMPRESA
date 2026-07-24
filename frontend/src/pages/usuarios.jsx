import { useContext, useEffect, useState } from 'react'
import { UsuariosContext } from '../../UsuariosContext.jsx'

export default function Usuarios() {
  const { usuarios, carregarUsuarios } = useContext(UsuariosContext)
  const [id, setId] = useState('')
  const [usuario, setUsuario] = useState(null)
  const [buscaRealizada, setBuscaRealizada] = useState(false)

  useEffect(() => {
    carregarUsuarios()
  }, [carregarUsuarios])

  {/* Função para carregar os detalhes de um usuário específico */}
  const carregarUsuario = async (idUsuario) => {
    const token = localStorage.getItem('access_token')

    setBuscaRealizada(true)

    if (!token || !idUsuario) {
      setUsuario(null)
      return
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/user/usuario/${idUsuario}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('access_token')
        }

        setUsuario(null)
        return
      }

      const dados = await response.json()

      setUsuario(dados.usuario ?? null)
    } catch (error) {
      console.error('Erro ao carregar usuario:', error)
      setUsuario(null)
    }
  }

  return (
    <div>
      <table className="usuarios-table">
        <thead className="usuarios-thead">
          <tr>
            <th>Id</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Cargo</th>
            <th>Ativo</th>
          </tr>
        </thead>
        <tbody className="usuarios-table-body">
          {usuarios.map((usuarioItem) => (
            <tr key={usuarioItem.id}>
              <td>{usuarioItem.id}</td>
              <td>{usuarioItem.nome}</td>
              <td>{usuarioItem.email}</td>
              <td>{usuarioItem.cargo}</td>
              <td>{usuarioItem.is_active ? 'Sim' : 'Nao'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <form
        className="usuario-form"
        onSubmit={(e) => {
          e.preventDefault()
          carregarUsuario(id)
        }}
      >
        <input
          type="number"
          value={id}
          onChange={(e) => {
            setId(e.target.value)
            setBuscaRealizada(false)
            setUsuario(null)
          }}
          placeholder="Digite o ID do usuario"
        />

        <button type="submit">Buscar</button>
      </form>

      {buscaRealizada && (
        <div className="usuario-detalhes">
          <h2>Detalhes do usuario</h2>
          {usuario ? (
            <div>
              <p><strong>Id:</strong> {usuario.id}</p>
              <p><strong>Nome:</strong> {usuario.nome}</p>
              <p><strong>Email:</strong> {usuario.email}</p>
              <p><strong>Cargo:</strong> {usuario.cargo}</p>
              <p><strong>Ativo:</strong> {usuario.is_active ? 'Sim' : 'Nao'}</p>
            </div>
          ) : (
            <p>Nenhum usuario encontrado com o ID fornecido.</p>
          )}
        </div>
      )}
    </div>
  )
}
