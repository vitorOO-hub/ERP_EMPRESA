from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from jose import jwt
from sqlalchemy.orm import Session

from dependencies import session, verificar_token
from main import ACCESS_TOKEN_EXPIRE_MINUTES, ALGORITHM, SECRET_KEY, bcrypt_context
from models import Usuarios
from schemas import LoginSchema, UsuarioSchema


user_router = APIRouter(prefix="/user", tags=["users"])


def formatar_cargo(cargo):
    if hasattr(cargo, "value"):
        return cargo.value
    if hasattr(cargo, "code"):
        return cargo.code
    return cargo


def usuario_publico(usuario: Usuarios):
    return {
        "id": usuario.id,
        "nome": usuario.nome,
        "email": usuario.email,
        "cargo": formatar_cargo(usuario.cargo),
        "is_active": usuario.is_active,
    }


def criar_token(user_id, duracao_token: timedelta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)):
    data_expiracao = datetime.now(timezone.utc) + duracao_token
    info_token = {"sub": str(user_id), "exp": data_expiracao}
    return jwt.encode(info_token, SECRET_KEY, algorithm=ALGORITHM)


def autenticar_usuario(email: str, senha: str, session: Session):
    usuario = session.query(Usuarios).filter(Usuarios.email == email).first()

    if not usuario:
        return False

    if not bcrypt_context.verify(senha, usuario.senha):
        return False

    return usuario


@user_router.get("/todos_usuarios")
async def todos_usuarios(
    usuario_logado: Usuarios = Depends(verificar_token),
    session: Session = Depends(session),
):
    todos_usuarios = session.query(Usuarios).all()
    return {"usuarios": [usuario_publico(usuario) for usuario in todos_usuarios]}


@user_router.get("/usuario/{id}")
async def usuario(
    id: int,
    usuario_logado: Usuarios = Depends(verificar_token),
    session: Session = Depends(session),
):
    usuario_especifico = session.query(Usuarios).filter(Usuarios.id == id).first()

    if not usuario_especifico:
        raise HTTPException(status_code=404, detail="Usuario nao encontrado")

    return {"usuario": usuario_publico(usuario_especifico)}


@user_router.post("/criar_conta")
async def criar_conta(usuario_schema: UsuarioSchema, session: Session = Depends(session)):
    usuario_existente = session.query(Usuarios).filter(Usuarios.email == usuario_schema.email).first()

    if usuario_existente:
        return {"message": "Usuario ja existe"}

    senha_criptografada = bcrypt_context.hash(usuario_schema.senha)
    novo_usuario = Usuarios(
        nome=usuario_schema.nome,
        email=usuario_schema.email,
        senha=senha_criptografada,
        is_active=usuario_schema.is_active,
        cargo=usuario_schema.cargo,
    )
    session.add(novo_usuario)
    session.commit()
    session.refresh(novo_usuario)

    return {"message": "Usuario criado com sucesso", "user": usuario_publico(novo_usuario)}


@user_router.post("/login")
async def login(login_schema: LoginSchema, session: Session = Depends(session)):
    usuario = autenticar_usuario(login_schema.email, login_schema.senha, session)

    if not usuario:
        raise HTTPException(status_code=401, detail="Usuario nao encontrado ou credenciais invalidas")

    if not usuario.is_active:
        raise HTTPException(status_code=403, detail="Usuario inativo, contate o administrador")

    access_token = criar_token(usuario.id)
    refresh_token = criar_token(usuario.id, timedelta(days=7))

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "Bearer",
    }


@user_router.post("/login-form")
async def login_form(
    dados_formulario: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(session),
):
    usuario = autenticar_usuario(dados_formulario.username, dados_formulario.password, session)

    if not usuario:
        raise HTTPException(status_code=401, detail="Usuario nao encontrado ou credenciais invalidas")

    if not usuario.is_active:
        raise HTTPException(status_code=403, detail="Usuario inativo, contate o administrador")

    access_token = criar_token(usuario.id)

    return {"access_token": access_token, "token_type": "Bearer"}


@user_router.get("/refresh_token")
async def refresh_token(usuario: Usuarios = Depends(verificar_token)):
    access_token = criar_token(usuario.id)

    return {"access_token": access_token, "token_type": "Bearer"}


@user_router.put("/atualizar_usuario/{id}")
async def atualizar_usuario(
    id: int,
    usuario_schema: UsuarioSchema,
    usuario_logado: Usuarios = Depends(verificar_token),
    session: Session = Depends(session),
):
    usuario = session.query(Usuarios).filter(Usuarios.id == id).first()

    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario nao encontrado")

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

    return {"message": "Usuario atualizado com sucesso", "user": usuario_publico(usuario)}
