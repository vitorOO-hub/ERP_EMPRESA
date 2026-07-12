import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { UsuariosContext } from '../../UsuariosContext.jsx'

const NavBar = () => {
  const { usuarios } = useContext(UsuariosContext)
  const totalUsuarios = Array.isArray(usuarios) ? usuarios.length : 0

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
        <Link className="nav-button" to="/login">
          Login
        </Link>
        <form className="search-form">
          <input type="search" placeholder="Search" aria-label="Search" />
          <button type="submit">Search</button>
        </form>
      </nav>
    </header>
  )
}

export default NavBar
