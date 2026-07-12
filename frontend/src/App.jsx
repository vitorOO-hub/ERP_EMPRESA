import { Navigate, Route, Routes } from 'react-router-dom'
import NavBar from './components/navbar.jsx'
import Usuarios from './pages/usuarios.jsx'
import Login from './pages/login.jsx'
import { UsuariosProvider } from '../UsuariosContext.jsx'
import './App.css'

function RotaPrivada({ children }) {
  const token = localStorage.getItem('access_token')

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return children
}

function App() {
  return (
    <UsuariosProvider>
      <NavBar />
    {/* Rotas Publicas */}
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

    {/* Rotas Privadas*/}
        <Route
          path="/usuarios"
          element={
            <RotaPrivada>
              <Usuarios />
            </RotaPrivada>
          }
        />

      </Routes>
    </UsuariosProvider>
  )
}

export default App
