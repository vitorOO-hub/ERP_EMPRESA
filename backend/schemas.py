from typing import Optional

from pydantic import BaseModel

class UsuarioSchema(BaseModel):
    nome: str
    email: str
    senha: str
    is_active: Optional[bool]
    cargo: Optional[str] = "Operador"

    class Config:
        from_attributes = True


class UsuarioUpdateSchema(BaseModel):
    nome: Optional[str] = None
    email: Optional[str] = None
    senha: Optional[str] = None
    is_active: Optional[bool] = None
    cargo: Optional[str] = None

    class Config:
        from_attributes = True

class LoginSchema(BaseModel):
    email: str
    senha: str

    class Config:
        from_attributes = True
