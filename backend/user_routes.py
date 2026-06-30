from fastapi import APIRouter, HTTPException, Depends
from models import Usuarios
from dependencies import session
from main import bcrypt_context

user_router = APIRouter(prefix = '/user', tags = ['users'])

@user_router.get('/todos_usuarios')
async def todos_usuarios(session = Depends(session)):
    todos_usuarios = session.query(Usuarios).all()
    return{'usuarios': todos_usuarios}

@user_router.get('/usuario/{id}')
async def usuario(id: int, session = Depends(session)):
    usuario_especifico = session.query(Usuarios).filter(Usuarios.id == id).first()
    return {'usuario': usuario_especifico}

@user_router.post('/criar_conta')
async def criar_conta(nome:str, email: str, senha: str, session = Depends(session)):
    usuario = session.query(Usuarios).filter(Usuarios.email == email, Usuarios.senha == senha).first()
    
    if usuario:
        return {'message': 'Usuário já existe'}
    else:
        senha_criptografada = bcrypt_context.hash(senha)
        novo_usuario = Usuarios(nome=nome, email=email, senha=senha_criptografada)
        session.add(novo_usuario)
        session.commit()
        return {'message': 'Usuário criado com sucesso', 'user': novo_usuario}

@user_router.put('/atualizar_usuario/{id}')
async def atualizar_usuario(id: int, nome: str = None, email: str = None, senha: str = None, session = Depends(session)):
    usuario = session.query(Usuarios).filter(Usuarios.id == id).first()
    
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    if nome is not None:
        usuario.nome = nome
    if email is not None:
        usuario.email = email
    if senha is not None:
        usuario.senha = bcrypt_context.hash(senha)

    session.commit()
    
    return {'message': 'Usuário atualizado com sucesso', 'user': usuario}   