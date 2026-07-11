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
                    </tr>
                </thead>
                <tbody>
                    {user.map((usuario) => (
                        <tr key={usuario.id}>
                            <td>{usuario.id}</td>
                            <td>{usuario.nome}</td>
                            <td>{usuario.email}</td>
                            <td>{usuario.cargo}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        </>
        
    )
}

