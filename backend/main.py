from fastapi import FastAPI
from passlib.context import CryptContext
from dotenv import load_dotenv
from database import engine

import models
import os

#Carrega variáveis de ambiente do arquivo .env
load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))

app = FastAPI()

bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

#Cria tabelas no postgresql
models.Base.metadata.create_all(bind=engine)

from auth_routes import auth_router
from user_routes import user_router

#Rotas
app.include_router(auth_router)
app.include_router(user_router)

