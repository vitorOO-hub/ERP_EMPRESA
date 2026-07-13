import { Navigate, Route, Routes } from 'react-router-dom'
import NavBar from './components/navbar.jsx'
import Usuarios from './pages/usuarios.jsx'
import Login from './pages/login.jsx'
import { UsuariosProvider } from '../UsuariosContext.jsx'
import './App.css'

function LoginPublico() {
  const token = localStorage.getItem('access_token')

  if (token) {
    return <Navigate to="/usuarios" replace />
  }

  return <Login />
}

function RotaPrivada({ children }) {
  const token = localStorage.getItem('access_token')

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return children
}

function AreaPrivada({ children }) {
  return (
    <RotaPrivada>
      <UsuariosProvider>
        <NavBar />
        <main className="app-content">{children}</main>
      </UsuariosProvider>
    </RotaPrivada>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPublico />} />
      <Route
        path="/usuarios"
        element={
          <AreaPrivada>
            <Usuarios />
          </AreaPrivada>
        }
      />
    </Routes>
  )
}

export default App
