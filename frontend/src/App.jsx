import { Navigate, Route, Routes } from 'react-router-dom'
import NavBar from './components/navbar.jsx'
import Usuarios from './pages/usuarios.jsx'
import Login from './pages/login.jsx'
import { UsuariosProvider } from '../UsuariosContext.jsx'
import './App.css'

function App() {
  return (
    <UsuariosProvider>
      <NavBar />

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/usuarios" element={<Usuarios />} />
      </Routes>
    </UsuariosProvider>
  )
}

export default App
