from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine

import models

app = FastAPI()

origins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
]

app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, 
                   allow_methods=["*"], allow_headers=["*"])

#Cria tabelas no postgresql
models.Base.metadata.create_all(bind=engine)

from auth_routes import auth_router
from user_routes import user_router

#Rotas
app.include_router(auth_router)
app.include_router(user_router)

# #executar fastapi
# uvicorn main:app --reload 

