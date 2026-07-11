from sqlalchemy import Boolean, Integer, ForeignKey, Column, String
from sqlalchemy_utils import ChoiceType
from datetime import datetime, timezone
from database import Base


class Usuarios(Base):
    __tablename__ = 'usuarios'

    cargos = (('Operador', 'Operador'),
              ("Administrador", 'Administrador'),)

    id = Column('id', Integer, primary_key=True, autoincrement=True)
    nome = Column('nome', String)
    email = Column('email', String, nullable=False, unique=True)
    senha = Column('senha', String)
    cargo = Column('cargo', ChoiceType(choices = cargos), default = 'Operador')
    is_active = Column('is_active', Boolean)
    created_at = Column('created_at', String, default=datetime.now(timezone.utc))

    def __init__(self, nome: str, email: str, senha: str, created_at: str = datetime.now(timezone.utc), cargo: str = 'Operador', is_active: bool = True):
        self.nome = nome
        self.email = email
        self.senha = senha
        self.cargo = cargo
        self.is_active = is_active
        self.created_at = created_at