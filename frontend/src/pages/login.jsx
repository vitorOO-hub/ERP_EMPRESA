import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const navigate = useNavigate();

  async function fazerLogin(event) {
    event.preventDefault()

    const resposta = await fetch('http://127.0.0.1:8000/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    })

    const dados = await resposta.json()
    
    if (resposta.status === 200) {
      navigate('/usuarios')  // Redireciona para a página inicial após o login bem-sucedido
    }
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
    </form>
  )
}