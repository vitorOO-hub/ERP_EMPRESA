from fastapi import FastAPI
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
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

origins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
]

app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, 
                   allow_methods=["*"], allow_headers=["*"])


bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

#Manda para o header a requisição do refresh token
oauth2_schema = OAuth2PasswordBearer(tokenUrl="/user/login-form")

#Cria tabelas no postgresql
models.Base.metadata.create_all(bind=engine)

from auth_routes import auth_router
from user_routes import user_router

#Rotas
app.include_router(auth_router)
app.include_router(user_router)

# #executar fastapi
# uvicorn main:app --reload 

