import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UsuariosContext } from '../../UsuariosContext.jsx'

const NavBar = () => {
  const { usuarios } = useContext(UsuariosContext)
  const totalUsuarios = Array.isArray(usuarios) ? usuarios.length : 0
  const navigate = useNavigate()

  function sair() {
    localStorage.removeItem('access_token')
    navigate('/login', { replace: true })
  }

  return (
    <header className="navbar">
      <Link className="navbar-brand" to="/login">
        Inventory Management App
      </Link>

      <nav className="navbar-actions" aria-label="Principal">
        <span className="stock-badge">Usuarios cadastrados {totalUsuarios}</span>
        <Link className="nav-button" to="/usuarios">
          Mostrar usuarios
        </Link>
        <button className="nav-button" type="button" onClick={sair}>
          Sair
        </button>
        <form className="search-form">
          <input type="search" placeholder="Search" aria-label="Search" />
          <button type="submit">Search</button>
        </form>
      </nav>
    </header>
  )
}

export default NavBar
