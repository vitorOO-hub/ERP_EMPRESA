import {useContext} from 'react'
import { UsuariosContext } from '../../UsuariosContext.jsx'

const NavBar = ({ onIndex, onOutra, onHome }) => {
  const [user] = useContext(UsuariosContext)
  const totalUsuarios = Array.isArray(user) ? user.length : 0
  
  return (
    <header className="navbar">
      <button className="navbar-brand" type="button" onClick={onHome}>
        Inventory Management App
      </button>

      <nav className="navbar-actions" aria-label="Principal">
        <span className="stock-badge">Usuarios cadastrados {totalUsuarios}</span>
        <button className="nav-button" type="button" onClick={onIndex}>
          Mostrar usuários
        </button>
        <button className="nav-button" type="button" onClick={onOutra}>
          Outra Página
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
