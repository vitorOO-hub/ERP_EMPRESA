import { useState } from 'react'
import NavBar from './components/navbar.jsx'
import Usuarios from './pages/usuarios.jsx'
import OutraPagina from './pages/outra.jsx'
import { UsuariosProvider } from '../UsuariosContext.jsx'
import './App.css'

function App() {
  const [paginaAtual, setPaginaAtual] = useState('home')

  return (
    <UsuariosProvider>
      <NavBar
        onIndex={() => setPaginaAtual('index')}
        onOutra={() => setPaginaAtual('outra')}
        onHome={() => setPaginaAtual('home')}
      />

      {paginaAtual === 'index' && <Usuarios />}
      {paginaAtual === 'outra' && <OutraPagina />}
    </UsuariosProvider>
  )
}

export default App
