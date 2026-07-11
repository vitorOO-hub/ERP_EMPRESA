from fastapi import APIRouter, HTTPException, Depends
from models import Usuarios
from dependencies import session, verificar_token
from main import SECRET_KEY, bcrypt_context, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from schemas import LoginSchema, UsuarioSchema
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from datetime import datetime, timedelta, timezone
from fastapi.security import OAuth2PasswordRequestForm

user_router = APIRouter(prefix = '/user', tags = ['users'])

def criar_token(user_id, duracao_token: timedelta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)):

    data_expiracao = datetime.now(timezone.utc) + duracao_token
    dici_info = {'sub': str(user_id), 'exp': data_expiracao}
    jwt_codificado = jwt.encode(dici_info, SECRET_KEY, algorithm=ALGORITHM)

    return jwt_codificado

def autenticar_usuario(email: str, senha: str, session: Session):
    usuario = session.query(Usuarios).filter(Usuarios.email == email).first()
    
    if not usuario:
        return False
    
    if not bcrypt_context.verify(senha, usuario.senha):
        return False
    
    return usuario

@user_router.get('/todos_usuarios')
async def todos_usuarios(session: Session = Depends(session)):
    todos_usuarios = session.query(Usuarios).all()
    return{'usuarios': todos_usuarios}

@user_router.get('/usuario/{id}')
async def usuario(id: int, session: Session = Depends(session)):
    usuario_especifico = session.query(Usuarios).filter(Usuarios.id == id).first()

    if not usuario_especifico:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    return {'usuario': usuario_especifico}

@user_router.post('/criar_conta')
async def criar_conta(usuario_schema: UsuarioSchema, session: Session = Depends(session)):
    usu = session.query(Usuarios).filter(Usuarios.email == usuario_schema.email).first()
    
    if usu:
        return {'message': 'Usuário já existe'}
    else:
        senha_criptografada = bcrypt_context.hash(usuario_schema.senha)
        novo_usuario = Usuarios(nome=usuario_schema.nome, email=usuario_schema.email, senha=senha_criptografada, 
                                is_active=usuario_schema.is_active, cargo=usuario_schema.cargo)
        session.add(novo_usuario)
        session.commit()
        return {'message': 'Usuário criado com sucesso', 'user': novo_usuario}

# Token JWT
@user_router.post('/login')
async def login(usuario: LoginSchema, session: Session = Depends(session)):
    usuario = autenticar_usuario(usuario.email, usuario.senha, session)

    if not usuario:
        raise HTTPException(status_code=401, detail="Usuario não encontrado ou Credenciais inválidas")
    else:

        if usuario.is_active == False:
            raise HTTPException(status_code=403, detail="Usuário inativo, contate o administrador")
        
        access_token = criar_token(usuario.id)
        refresh_token = criar_token(usuario.id, timedelta(days=7))  # Token de atualização válido por 7 dias

        return {'access_token': access_token, 
                'refresh_token': refresh_token,
                'token_type': 'Bearer'}

#Formulario de login no oauth2
@user_router.post('/login-form')
async def login_form(dados_formulario: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(session)):
    usuario = autenticar_usuario(dados_formulario.username, dados_formulario.password, session)
    if not usuario:
        raise HTTPException(status_code=401, detail="Usuario não encontrado ou Credenciais inválidas")
    else:
        access_token = criar_token(usuario.id)

        return {'access_token': access_token, 
                'token_type': 'Bearer'}

#Gerar novo refresh token
@user_router.get('/refresh_token')
async def refresh_token(usuario: Usuarios = Depends(verificar_token), session: Session = Depends(session)):
    access_token = criar_token(usuario.id)

    return {'access_token': access_token, 
            'token_type': 'Bearer'}

@user_router.put('/atualizar_usuario/{id}')
async def atualizar_usuario(id: int, usuario_schema: UsuarioSchema, session: Session = Depends(session)):
    usuario = session.query(Usuarios).filter(Usuarios.id == id).first()
    
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    if usuario_schema.nome is not None:
        usuario.nome = usuario_schema.nome
    if usuario_schema.email is not None:
        usuario.email = usuario_schema.email
    if usuario_schema.senha is not None:
        usuario.senha = bcrypt_context.hash(usuario_schema.senha)
    if usuario_schema.is_active is not None:
        usuario.is_active = usuario_schema.is_active
    if usuario_schema.cargo is not None:
        usuario.cargo = usuario_schema.cargo

    session.commit()
    
    return {'message': 'Usuário atualizado com sucesso', 'user': usuario}   