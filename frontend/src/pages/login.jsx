import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const navigate = useNavigate()

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
    navigate('/usuarios')
  }

  return (
    <main className="login-page">
      <section className="login-panel">
        <div className="login-copy">
          <span className="login-kicker">ERP Empresa</span>
          <h1>Acesso interno</h1>
          <p>Entre com suas credenciais para acessar o painel.</p>
        </div>

        <form className="login-form" onSubmit={fazerLogin}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="seu@email.com"
            />
          </label>

          <label>
            Senha
            <input
              type="password"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              placeholder="Sua senha"
            />
          </label>

          <button type="submit">Entrar</button>

          {erro && <p className="login-error">{erro}</p>}
        </form>
      </section>
    </main>
  )
}
