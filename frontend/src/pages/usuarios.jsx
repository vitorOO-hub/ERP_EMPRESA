import {useContext} from 'react'
import {UsuariosContext} from '../../UsuariosContext.jsx'

export default function Home() {
    const [user] = useContext(UsuariosContext)

    return (
        <>
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
                    {user.map((usuario) => (
                        <tr key={usuario.id}>
                            <td>{usuario.id}</td>
                            <td>{usuario.nome}</td>
                            <td>{usuario.email}</td>
                            <td>{usuario.cargo?.value ?? usuario.cargo?.code ?? usuario.cargo}</td>
                            <td>{usuario.is_active ? 'Sim' : 'Não'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </>
    )
}

