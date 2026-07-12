import { useContext, useEffect } from 'react'
import { UsuariosContext } from '../../UsuariosContext.jsx'

export default function Usuarios() {
  const { usuarios, carregarUsuarios } = useContext(UsuariosContext)

  useEffect(() => {
    carregarUsuarios()
  }, [carregarUsuarios])

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Cargo</th>
            <th>Ativo</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.id}</td>
              <td>{usuario.nome}</td>
              <td>{usuario.email}</td>
              <td>{usuario.cargo}</td>
              <td>{usuario.is_active ? 'Sim' : 'Nao'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
