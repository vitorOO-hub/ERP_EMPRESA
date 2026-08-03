from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext

bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

#Manda para o header a requisição do refresh token
oauth2_schema = OAuth2PasswordBearer(tokenUrl="/user/login-form")