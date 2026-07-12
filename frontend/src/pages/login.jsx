import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UsuariosContext } from '../../UsuariosContext.jsx'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const navigate = useNavigate()
  const { carregarUsuarios } = useContext(UsuariosContext)

  async function fazerLogin(event) {
    event.preventDefault()
    setErro('')

    const resposta = await fetch('http://127.0.0.1:8000/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    })

    const dados = await resposta.json()

    if (!resposta.ok) {
      setErro(dados.detail || 'Email ou senha incorretos')
      return
    }

    localStorage.setItem('access_token', dados.access_token)
    await carregarUsuarios()
    navigate('/usuarios')
  }

  return (
    <form onSubmit={fazerLogin}>
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Email"
      />

      <input
        type="password"
        value={senha}
        onChange={(event) => setSenha(event.target.value)}
        placeholder="Senha"
      />

      <button type="submit">Entrar</button>

      {erro && <p>{erro}</p>}
    </form>
  )
}
