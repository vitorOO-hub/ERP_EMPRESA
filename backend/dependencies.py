from database import SessionLocal
from models import Usuarios
from sqlalchemy.orm import Session, sessionmaker
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
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido, verifique a validade do token")
    
    usuario = session.query(Usuarios).filter(Usuarios.id == id_usuario).first()

    if not usuario:
        raise HTTPException(status_code=401, detail="Acesso inválido")    
    
    return usuario