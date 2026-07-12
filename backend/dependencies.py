from database import SessionLocal
from models import Usuarios
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException
from jose import jwt, JWTError
from main import SECRET_KEY, ALGORITHM, oauth2_schema


def session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def verificar_token(token: str = Depends(oauth2_schema), session: Session = Depends(session)):
    try:
        dic_info = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        id_usuario = int(dic_info.get("sub"))
    except (JWTError, TypeError, ValueError):
        raise HTTPException(status_code=401, detail="Token invalido")

    usuario = session.query(Usuarios).filter(Usuarios.id == id_usuario).first()

    if not usuario:
        raise HTTPException(status_code=401, detail="Acesso invalido")

    if not usuario.is_active:
        raise HTTPException(status_code=403, detail="Usuario inativo")

    return usuario
