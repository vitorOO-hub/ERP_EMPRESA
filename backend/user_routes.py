from fastapi import APIRouter, Depends
from models import Usuarios
from services import session

user_router = APIRouter(prefix = '/user', tags = ['users'])

@user_router.get('/')
async def usuarios():
    return('')

@user_router.post('/criar_conta')
async def criar_conta(nome:str, email: str, senha: str, session = Depends(session)):
    usuario = session.query(Usuarios).filter(Usuarios.email == email, Usuarios.senha == senha).first()
    
    if usuario:
        return {'message': 'Usuário já existe'}
    else:
        novo_usuario = Usuarios(nome=nome, email=email, senha=senha)
        session.add(novo_usuario)
        session.commit()
        return {'message': 'Usuário criado com sucesso', 'user': novo_usuario}

    