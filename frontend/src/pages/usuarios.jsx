import { useContext, useEffect, useState } from 'react'
import { UsuariosContext } from '../../UsuariosContext.jsx'

export default function Usuarios() {
  const { usuarios, carregarUsuarios } = useContext(UsuariosContext)
  const [id, setId] = useState('')
  const [usuario, setUsuario] = useState(null)
  const [novosdados, setNovosDados] = useState({
    nome: "",
    email: "",
    senha: "",
    cargo: "",
    is_active: false,
  })
  const [atualizarUsuario, setAtualizarUsuario] = useState(false)
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null)
  const [mostrarPopup, setMostrarPopup] = useState(false)
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

  const atualizar_usuario = async (idUsuario) => {
    const token = localStorage.getItem('access_token')

    setAtualizarUsuario(false)

    if (!token || !idUsuario) {
      setUsuario(null)
      return
    }

    const dadosAtualizados = {
      nome: novosdados.nome,
      email: novosdados.email,
      cargo: novosdados.cargo,
      is_active: novosdados.is_active,
    }

    if (novosdados.senha.trim() !== '') {
      dadosAtualizados.senha = novosdados.senha
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/user/atualizar_usuario/${idUsuario}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dadosAtualizados)
        }
      )

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('access_token')
        }
        setAtualizarUsuario(false)
        return
      }

      const dados = await response.json()
      const usuarioAtualizado = dados.user ?? null

      if (usuarioAtualizado) {
        setUsuarioSelecionado(usuarioAtualizado)
        setNovosDados({
          nome: usuarioAtualizado.nome ?? "",
          email: usuarioAtualizado.email ?? "",
          senha: "",
          cargo: usuarioAtualizado.cargo ?? "",
          is_active: Boolean(usuarioAtualizado.is_active),
        })

        if (usuario?.id === usuarioAtualizado.id) {
          setUsuario(usuarioAtualizado)
        }
      }

      await carregarUsuarios()
      setAtualizarUsuario(true)
    } catch (error) {
      console.error('Erro ao atualizar usuario:', error)
      setAtualizarUsuario(false)
    }
  }

function abrirDetalhes(usuario) {
  setUsuarioSelecionado(usuario)
  setNovosDados({
    nome: usuario.nome,
    email: usuario.email,
    senha: "",
    cargo: usuario.cargo,
    is_active: usuario.is_active,
  })
  setAtualizarUsuario(false)
  setMostrarPopup(true)
}

function fecharDetalhes() {
  setMostrarPopup(false)
  setAtualizarUsuario(false)
  setNovosDados({
    nome: "",
    email: "",
    senha: "",
    cargo: "",
    is_active: false,
  })
  setUsuarioSelecionado(null)
}

  return (
    <div>
      <h2>Lista de usuários</h2>
      <table className="usuarios-table">
        <thead className="usuarios-thead">
          <tr>
            <th>Id</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Cargo</th>
            <th>Ativo</th>
            <th>Detalhes</th>
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
              <td><button onClick={() => abrirDetalhes(usuarioItem)}>Detalhes</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Buscar usuario por ID</h2>
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

  {usuarioSelecionado && mostrarPopup && (
    
    <div className="popup-fundo">
    <div className="popup-card">
      
      <button className="popup-fechar" onClick={fecharDetalhes}>
        X
      </button>

    <form
        className="novos_dados_usuario-form"
        onSubmit={async (e) => {
          e.preventDefault()
          await atualizar_usuario(usuarioSelecionado.id)
        }}
      >
      
        <input
          type="text"
          value={novosdados.nome}
          onChange={(e) => {
            setNovosDados({ ...novosdados, nome: e.target.value })
          }}
          placeholder="Digite o nome do usuario"
        />

        <input
          type="text"
          value={novosdados.email}
          onChange={(e) => {
            setNovosDados({ ...novosdados, email: e.target.value })
          }}
          placeholder="Digite o email do usuario"
        />

        <input
          type="password"
          value={novosdados.senha}
          onChange={(e) => {
            setNovosDados({ ...novosdados, senha: e.target.value })
          }}
          placeholder="Digite a senha do usuario"
        />

        <input
          type="text"
          value={novosdados.cargo}
          onChange={(e) => {
            setNovosDados({ ...novosdados, cargo: e.target.value })
          }}
          placeholder="Digite o cargo do usuario"
        />

        <input
          type="checkbox"
          checked={novosdados.is_active}
          onChange={(e) => {
            setNovosDados({ ...novosdados, is_active: e.target.checked })
          }}
        />

        <button type="submit">Atualizar</button>
      </form>

      {atualizarUsuario && (
        <alert>
          <p>Usuario atualizado com sucesso!</p>
        </alert>
      )}

      </div>
  </div>
  )}
  </div>)}
