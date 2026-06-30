from fastapi import FastAPI
import models
from database import engine, SessionLocal
from sqlalchemy.orm import Session

app = FastAPI()

#Cria tabelas no postgresql
models.Base.metadata.create_all(bind=engine)

from auth_routes import auth_router
from user_routes import user_router

#Rotas
app.include_router(auth_router)
app.include_router(user_router)

